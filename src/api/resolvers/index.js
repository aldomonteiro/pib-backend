import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
import { schemaComposer } from 'graphql-compose';
import Category from '../models/categories';
import Flavor from '../models/flavors';
import Topping from '../models/toppings';
import Size from '../models/sizes'
import Pricing from '../models/pricings';
import { addCategoryQueryFields, addCategoryMutationFields } from './categoryResolvers';
import { addPricingQueryFields } from './pricingResolver';
import { addSizeQueryFields } from './sizeResolver';

const customizationOptions = {}; // left it empty for simplicity, described below
const CategoryTC = composeWithMongoose(Category, customizationOptions);
const FlavorTC = composeWithMongoose(Flavor, customizationOptions);
const ToppingTC = composeWithMongoose(Topping, customizationOptions);
const PricingTC = composeWithMongoose(Pricing, customizationOptions);
const SizeTC = composeWithMongoose(Size, customizationOptions);

addCategoryQueryFields(CategoryTC, schemaComposer);
addCategoryMutationFields(CategoryTC, schemaComposer);
addPricingQueryFields(PricingTC, schemaComposer);
addSizeQueryFields(SizeTC, schemaComposer);

// TODO: move to its own file
schemaComposer.Query.addFields({
  flavorById: FlavorTC.getResolver('findById'),
  flavorByIds: FlavorTC.getResolver('findByIds'),
  flavorOne: FlavorTC.getResolver('findOne'),
  flavorMany: FlavorTC.getResolver('findMany'),
  flavorCount: FlavorTC.getResolver('count'),
  flavorConnection: FlavorTC.getResolver('connection'),
  flavorPagination: FlavorTC.getResolver('pagination'),
});

// TODO: move to its own file
schemaComposer.Query.addFields({
  ToppingById: ToppingTC.getResolver('findById'),
  ToppingByIds: ToppingTC.getResolver('findByIds'),
  ToppingOne: ToppingTC.getResolver('findOne'),
  ToppingMany: ToppingTC.getResolver('findMany'),
  ToppingCount: ToppingTC.getResolver('count'),
  ToppingConnection: ToppingTC.getResolver('connection'),
  ToppingPagination: ToppingTC.getResolver('pagination'),
});

CategoryTC.addRelation(
  'flavors',
  {
    resolver: () => FlavorTC.getResolver('findMany'),
    prepareArgs: {
      filter: (source) => ({
        categoryId: source.id,
        pageId: source.pageId,
      }),
    },
    projection: { id: 1, pageId: 1 }, // point fields in source object, which should be fetched from DB
  }
);

CategoryTC.addRelation(
  'pricings',
  {
    resolver: () => PricingTC.getResolver('findMany'),
    prepareArgs: {
      filter: (source) => ({ // source belongs do category
        categoryId: source.id,
        pageId: source.pageId,
      }),
    },
    projection: { id: 1, pageId: 1 }, // point fields in source object, which should be fetched from DB
  }
);

FlavorTC.addRelation(
  'toppingsNames',
  {
    resolver: () => ToppingTC.getResolver('findMany'),
    prepareArgs: {
      filter: (source) => ({
        _operators: { // Applying criteria on fields which have
          // operators enabled for them (by default, indexed fields only)
          id: { in: source.toppings },
        },
        pageId: source.pageId,
      }),
    },
    projection: { id: 1, pageId: 1 }, // point fields in source object, which should be fetched from DB
  }
);

PricingTC.addRelation(
  'size',
  {
    resolver: () => SizeTC.getResolver('findOne'),
    prepareArgs: {
      filter: (source) => ({ // source belongs to pricing
        id: source.sizeId,
        pageId: source.pageId,
      }),
    },
    projection: { sizeId: 1, pageId: 1 }, // point fields in source object, which should be fetched from DB
  }
);

PricingTC.addRelation(
  'category',
  {
    resolver: () => CategoryTC.getResolver('findOne'),
    prepareArgs: {
      filter: (source) => ({ // source belongs to pricing
        id: source.categoryId,
        pageId: source.pageId,
      }),
    },
    projection: { categoryId: 1, pageId: 1 }, // point fields in source object, which should be fetched from DB
  }
);


const schema = schemaComposer.buildSchema();
export default { schema };

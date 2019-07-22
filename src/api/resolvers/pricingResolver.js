export const addPricingQueryFields = (PricingTC, schemaComposer) => {
  schemaComposer.Query.addFields({
    pricingById: PricingTC.getResolver('findById'),
    pricingByIds: PricingTC.getResolver('findByIds'),
    pricingOne: PricingTC.getResolver('findOne'),
    pricingMany: PricingTC.getResolver('findMany'),
    pricingCount: PricingTC.getResolver('count'),
    pricingConnection: PricingTC.getResolver('connection'),
    pricingPagination: PricingTC.getResolver('pagination'),
  });
}




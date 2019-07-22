export const addSizeQueryFields = (SizeTC, schemaComposer) => {
  schemaComposer.Query.addFields({
    sizeById: SizeTC.getResolver('findById'),
    sizeByIds: SizeTC.getResolver('findByIds'),
    sizeOne: SizeTC.getResolver('findOne'),
    sizeMany: SizeTC.getResolver('findMany'),
    sizeCount: SizeTC.getResolver('count'),
    sizeConnection: SizeTC.getResolver('connection'),
    sizePagination: SizeTC.getResolver('pagination'),
  });
}


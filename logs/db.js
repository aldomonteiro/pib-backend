var pagesArray = new Array();
pagesArray.push('947115235484171');
pagesArray.push('307519123184673');

var userID = '171581173796245';

print('* Connected to the database');

// delete pricings, sizes and flavors for the page:
for (var i = 0; i < pagesArray.length; i++) {
    var pageID = pagesArray[i];
    print('*** PageID:' + pageID + '***');

    print('* Deleting pricings:');
    db.pricings.deleteMany({ pageId: pageID });
    print('* Deleting sizes:');
    db.sizes.deleteMany({ pageId: pageID });
    print('* Deleting flavors:');
    db.flavors.deleteMany({ pageId: pageID });
    print('* Deleting stores:');
    db.stores.deleteOne({ pageId: pageID });
    print('* Deleting items:');
    db.items.deleteMany({ pageId: pageID });
    print('* Deleting orders:');
    db.orders.deleteMany({ pageId: pageID });
    print('* Deleting customers:');
    db.customers.deleteMany({ pageId: pageID });
    print('* Deleting page:');
    db.pages.deleteOne({ id: pageID });
}

print('* Deleting user:');
db.users.deleteOne({ userID: userID });



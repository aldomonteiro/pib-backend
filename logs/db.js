var pagesArray = new Array();
pagesArray.push('947115235484171');
pagesArray.push('307519123184673');
pagesArray.push('265213094338977');
pagesArray.push('2123901781156118');
pagesArray.push('580559252379681');

var usersArray = new Array();
usersArray.push('174457213508641');
usersArray.push('141606196820358');
usersArray.push('106624043692655');
usersArray.push('107417596946481');
usersArray.push('106965730263507');

printjson('* Connected to the database');

// delete pricings, sizes and flavors for the page:
for (var i = 0; i < pagesArray.length; i++) {
    var pageID = pagesArray[i];
    ('*** PageID:' + pageID + '***');
    print('* Deleting pricings:');
    printjson(db.pricings.deleteMany({ pageId: pageID }));
    print('* Deleting sizes:');
    printjson(db.sizes.deleteMany({ pageId: pageID }));
    print('* Deleting flavors:');
    printjson(db.flavors.deleteMany({ pageId: pageID }));
    print('* Deleting stores:');
    printjson(db.stores.deleteOne({ pageId: pageID }));
    print('* Deleting items:');
    printjson(db.items.deleteMany({ pageId: pageID }));
    print('* Deleting orders:');
    printjson(db.orders.deleteMany({ pageId: pageID }));
    print('* Deleting customers:');
    printjson(db.customers.deleteMany({ pageId: pageID }));
    print('* Deleting page:');
    printjson(db.pages.deleteOne({ id: pageID }));
}
print('* Deleting users:');
// delete pricings, sizes and flavors for the page:
for (var i = 0; i < usersArray.length; i++) {
    var userID = usersArray[i];
    printjson(db.users.deleteOne({ userID: userID }));
}


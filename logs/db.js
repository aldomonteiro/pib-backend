var pagesArray = new Array();
pagesArray.push('947115235484171');
pagesArray.push('307519123184673');
pagesArray.push('265213094338977');
pagesArray.push('2123901781156118');
pagesArray.push('580559252379681');
pagesArray.push('183971055882144');
pagesArray.push('704202906645913');
pagesArray.push('2121200918121763');
pagesArray.push('304832226791979');
pagesArray.push('354668958621601');
pagesArray.push('756517111367872');
pagesArray.push('435366270326270');
pagesArray.push('311527369681227');

var usersArray = new Array();
usersArray.push('174457213508641');
usersArray.push('141606196820358');
usersArray.push('106624043692655'); // y
usersArray.push('106965730263507'); // y
usersArray.push('106789207010646'); // y
usersArray.push('107417596946481'); // y
usersArray.push('136517473954794'); // y
usersArray.push('108525270104663'); // y


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


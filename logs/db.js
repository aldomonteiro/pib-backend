var pagesArray = new Array();
pagesArray.push('947115235484171');
pagesArray.push('307519123184673');

var userID = '174457213508641';

printjson('* Connected to the database');

// delete pricings, sizes and flavors for the page:
for (var i = 0; i < pagesArray.length; i++) {
    var pageID = pagesArray[i];
    ('*** PageID:' + pageID + '***');

    printjson('* Deleting pricings:', db.pricings.deleteMany({ pageId: pageID }));
    printjson('* Deleting sizes:', db.sizes.deleteMany({ pageId: pageID }));
    printjson('* Deleting flavors:', db.flavors.deleteMany({ pageId: pageID }));
    printjson('* Deleting stores:', db.stores.deleteOne({ pageId: pageID }));
    printjson('* Deleting items:', db.items.deleteMany({ pageId: pageID }));
    printjson('* Deleting orders:', db.orders.deleteMany({ pageId: pageID }));
    printjson('* Deleting customers:', db.customers.deleteMany({ pageId: pageID }));
    printjson('* Deleting page:', db.pages.deleteOne({ id: pageID }));
}

printjson('* Deleting user:', db.users.deleteOne({ userID: userID }));



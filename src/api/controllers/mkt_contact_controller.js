import MktContact from '../models/mkt_contact';

export const updateMktContact = async mktData => {
    try {
        const { pageID, userID,
            last_answer, how_know_company,
            restaurant_related, restaurant_owner, restaurant_employee,
            started_test, saw_how_it_works,
            contact_form, contact_phone, contact_mail,
            text, final } = mktData;
        let mktContact = await MktContact.findOne({ pageId: pageID, userId: userID }).exec();
        if (mktContact) {
            if (last_answer)
                mktContact.last_answer = last_answer;
            if (how_know_company)
                mktContact.how_know_company = how_know_company;
            if (typeof restaurant_related === 'boolean')
                mktContact.restaurant_related = restaurant_related;
            if (typeof restaurant_owner === 'boolean')
                mktContact.restaurant_owner = restaurant_owner;
            if (typeof restaurant_employee === 'boolean')
                mktContact.restaurant_employee = restaurant_employee;
            if (contact_form)
                mktContact.contact_form = contact_form;
            if (typeof started_test === 'boolean')
                mktContact.started_test = started_test;
            if (typeof saw_how_it_works === 'boolean')
                mktContact.saw_how_it_works = saw_how_it_works;
            if (contact_phone)
                mktContact.contact_phone = contact_phone;
            if (contact_mail)
                mktContact.contact_mail = contact_mail;
            if (text)
                mktContact.free_msg = text;
            if (typeof final === 'boolean')
                mktContact.final = final;
        } else {
            mktContact = new MktContact({
                pageId: pageID,
                userId: userID,
                last_answer: last_answer,
                restaurant_related: restaurant_related,
                restaurant_owner: restaurant_owner,
                restaurant_employee: restaurant_employee,
                contact_form: contact_form,
                contact_phone: contact_phone,
                contact_mail: contact_mail,
                free_msg: text,
                final: final,
            });
        }
        await mktContact.save();

    } catch (err) {
        console.error({ updateMktContact: err });
    }
}

export const getMktContact = async mktData => {
    const { pageID, userID } = mktData;
    return await MktContact.findOne({ userId: userID, pageId: pageID }).exec();
}
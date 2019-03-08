import Account from '../models/accounts';
import dotenv from 'dotenv';

const configureCielo = () => {
    dotenv.config();

    const env = process.env.NODE_ENV || 'production';
    let merchant_id;
    let merchant_key;

    if (env === 'production') {
        merchant_id = process.env.CIELO_MERCHANT_ID;
        merchant_key = process.env.CIELO_MERCHANT_KEY;
    } else {
        merchant_id = process.env.SANDBOX_CIELO_MERCHANT_ID;
        merchant_key = process.env.SANDBOX_CIELO_MERCHANT_KEY;
    }

    const paramsCielo = {
        MerchantId: merchant_id,
        MerchantKey: merchant_key,
        sandbox: true, // Opcional - Ambiente de Testes
        debug: true, // Opcional - Exibe os dados enviados na requisição para a Cielo
    }

    var cielo = require('cielo')(paramsCielo);
    return cielo;
}

// List one record by filtering by ID
export const accounts_get_one = (req, res) => {
    if (req.params && req.params.id) {

        User.findOne({ userID: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json({ message: err.errMsg });
            } else {
                res.status(200).json(doc);
            }
        });
    }
}

// UPDATE
export const accounts_update = async (req, res) => {
    try {
        console.info(req.body);
        const {
            id,
            name,
            number,
            expiry,
            cvc,
            issuer,
        } = req.body;

        // const returnCielo = await createCieloRecurrency({ id, name, number, expiry, cvc, issuer });
        // console.log(returnCielo);

        const pageId = req.currentUser.activePage;

        Account.findOne({ pageId: pageId, id: id }, (err, doc) => {
            if (!err) {
                doc.id = id;
                doc.pageId = pageId;
                doc.name = name;
                doc.number = number;
                doc.expiry = expiry;
                doc.cvc = cvc;
                doc.issuer = issuer;

                doc.save((err, result) => {
                    if (err) {
                        res.status(500).json({ message: err.errmsg });
                    } else {
                        res.status(200).json(result);
                    }
                });
            } else {
                res.status(500).json({ message: err.errmsg });
            }
        });
    } catch (accountsUpdateErr) {
        console.error({ accountsUpdateErr });
        res.status(500).json({ message: accountsUpdateErr.errmsg });
    }
}

const createCieloRecurrency = async (params) => {
    const recurrencyParams = {
        MerchantOrderId: '2014113245231706',
        Customer: {
            Name: params.name,
        },
        Payment: {
            Type: 'CreditCard',
            Amount: 19700,
            Installments: 1,
            SoftDescriptor: 'PizzaiBot',
            RecurrentPayment: {
                AuthorizeNow: 'true',
                EndDate: '2020-12-01',
                Interval: 'Monthly',
            },
            CreditCard: {
                CardNumber: params.number,
                Holder: params.name,
                ExpirationDate: params.expiry,
                SecurityCode: params.cvc,
                SaveCard: 'false',
                Brand: params.issuer,
            },
        },
    }

    const cielo = configureCielo();
    return await cielo.recurrentPayments.firstScheduledRecurrence(recurrencyParams);
}

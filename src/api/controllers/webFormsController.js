import WebForm from '../models/webForms';

// CREATE A NEW RECORD
export const webform_create = async (req, res) => {
    console.log(req.body);
    if (req.body) {
        let { id } = req.body;

        if (!id || id === 0) {
            const lastId = await WebForm.find().select('id').sort('-id').limit(1).exec();
            id = 1;
            if (lastId && lastId.length)
                id = lastId[0].id + 1;
        }

        const newRecord = new WebForm({
            id: id,
            name: req.body.nome,
            email: req.body.email,
            phone: req.body.whatsapp,
            obs: req.body.obs,
        });

        newRecord.save()
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                res.status(500).json({ message: err.errmsg });
            });
    }
}

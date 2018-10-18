const botController = (req, res, controllers) => {
    const pageId = req.body.pageid;
    const bot = controllers[pageId].spawn({});
    controllers[pageId].handleWebhookPayload(req, res, bot);
}

export default botController;

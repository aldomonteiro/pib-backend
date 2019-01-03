/**
 * Bot Marketing Controller
 */

import { Buttons, Elements, QuickReplies } from 'facebook-messenger-bot';
import { updateMktContact, getMktContact } from '../controllers/mkt_contact_controller';

const _event = 'PIZZAIBOT_MARKETING';

export const m_checkLastQuestion = async (pageID, userID) => {

    const mktContact = await getMktContact({ pageID, userID });

    if (mktContact) {
        return mktContact.last_answer;
    } else return null;
}

export const m_askHowGetHere = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();
    let _txt = 'Vou te ajudar com as suas dúvidas, tá bom? \
    Mas, antes de mais nada, preciso saber de uma coisa: \
    Como você ficou conhecendo o Pizzaibot?';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Vi pizzaria usar", data: "howget_pizzaria", event: _event });
    replies.add({ text: "Anúncio Facebook", data: "howget_facebookad", event: _event });
    replies.add({ text: "Vocês me procuraram!", data: "howget_activemarketing", event: _event });
    replies.add({ text: "Não lembro", data: "howget_dontremember", event: _event });
    out.setQuickReplies(replies);
    return out;
}


export const m_askForRestaurant = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data, how_know_company: data });

    const out = new Elements();
    let _txt = 'Você possui ou trabalha em um restaurante ou pizzaria?';

    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Sim", data: "restaurant_yes", event: _event });
    replies.add({ text: "Não", data: "restaurant_no", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_askForOwnership = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, restaurant_related: true, last_answer: data });

    const out = new Elements();
    let _txt = 'Muito bom, então, com toda certeza eu posso ser útil para você!\n';
    _txt = _txt + 'Você é o dono(a) do restaurante/pizzaria ou trabalha para ele direta ou indiretamente?\n';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Sou dono(a)", data: "owner_yes", event: _event });
    replies.add({ text: "Trabalho para", data: "employee_yes", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_askForOptions = async (data, pageID, userID, relation) => {
    if (relation === 'owner')
        await updateMktContact({ pageID, userID, last_answer: data, restaurant_owner: true });
    else if (relation === 'employee')
        await updateMktContact({ pageID, userID, last_answer: data, restaurant_employee: true });
    else
        await updateMktContact({ pageID, userID, last_answer: data });


    const out = new Elements();
    let _txt = 'Então vou te mostrar algumas coisas que posso te ajudar agora\n';
    _txt = _txt + 'Clique em uma das opções disponíveis que eu acompanho contigo\n';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Como funciona?", data: "options_howitworks", event: _event });
    replies.add({ text: "Quanto custa?", data: "options_howmuch", event: _event });
    replies.add({ text: "Quero testar!", data: "options_wanttest", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_howItWorks = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data, saw_how_it_works: true });

    const out = new Elements();
    let _txt = 'O primeiro passo é acessar o site do sistema: https://admin.pizzaibot.com. \
    Lá, você vai clicar em "Conectar com o Facebook", permitir acesso do sistema ao Facebook e \
    acessar a administração do nosso sistema.';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Entendi, e depois?", data: "howitworks_2", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_howItWorks2 = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();
    let _txt = 'A primeira tela da administração mostra todas as páginas do Facebook que você é administrador. \
    Você escolhe a página do Restaurante/Pizzaria que será conectado ao Bot e clica no botão "Confirmar"';

    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Ok, e aí?", data: "howitworks_3", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_howItWorks3 = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();
    let _txt = 'Depois disso você precisará revisar os sabores do seu Cardápio, Bebidas, Preços e Horários de Funcionamento. \
    Você verá que já temos algumas informações de exemplo cadastradas, você pode removê-las ou usá-las.';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Certo, e o que mais?", data: "howitworks_4", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_howItWorks4 = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();
    let _txt = 'Quando as informações do seu cardápio estiverem concluídas, basta você acessar o menu "Páginas" no lado esquerdo da tela, \
    editar a página que você selecionou para revisar os cadastros e clicar no botão "Ativar Bot".';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Olha só, e então?", data: "howitworks_5", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_howItWorks5 = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();
    let _txt = 'A partir desse momento, o Messenger ligado a sua página do Facebook já vai estar automatizado, \
    quando algum cliente enviar alguma mensagem para a sua página, quem vai responder será o Pizzaibot.';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Quero testar!", data: "options_wanttest", event: _event });
    replies.add({ text: "Ainda tenho dúvidas!", data: "orderConfirmation_question", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_showPrices = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();
    let _txt = 'No nosso site temos alguns detalhes dos valores: \
    https://www.pizzaibot.com/planos, acessa lá e veja nossos valores atualizados.';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Quero testar!", data: "options_wanttest", event: _event });

    const mktContact = await getMktContact({ pageID, userID });
    if (mktContact && !mktContact.saw_how_it_works) {
        replies.add({ text: "Como funciona?", data: "options_howitworks", event: _event });
    }
    replies.add({ text: "Ainda tenho dúvidas!", data: "orderConfirmation_question", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_askForTestType = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();
    let _txt = 'Muito bem, temos 2 opções: testar como cliente e testar como pizzaria.\n';
    _txt = _txt + 'Escolhe uma delas por favor!\n';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Testar como cliente", data: "testtype_customer", event: _event });
    replies.add({ text: "Testar como pizzaria", data: "testtype_pizzaria", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_askForBeginTest = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, started_test: true, last_answer: data });

    const out = new Elements();

    let _txt = 'Ok, agora vou te mostrar as opções que o bot mostra para um cliente,';
    _txt = _txt + 'assim você poderá ver como os seus clientes vão usar a ferramenta. É só clicar em Começar!\n';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Começar", data: "testtypecustomer_begin", event: _event });
    out.setQuickReplies(replies);
    return out;
}

/**
 * Show after anser testtype_pizzaria
 * @param {*} data 
 * @param {*} pageID 
 * @param {*} userID 
 */
export const m_askTestTypePizzaria = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();
    let _txt = 'Para utilizar essa opção você precisa se cadastrar na administração do sistema \
    e habilitar o Bot para alguma página (Se você preferir, pode criar uma página teste no Facebook \
    e usá-la para os seus testes - você poderá simular ser cliente dessa página.';

    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Quero usar!", data: "orderConfirmation_start", event: _event });

    const mktContact = await getMktContact({ pageID, userID });
    if (mktContact && !mktContact.saw_how_it_works) {
        replies.add({ text: "Como funciona?", data: "options_howitworks", event: _event });
    }
    out.setQuickReplies(replies);
    return out;
}

export const m_afterOrderConfirmation = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();

    let _txt = 'Olha que legal, você chegou até o final de um pedido teste.. Eu não vou te mandar uma pizza não tá? 😃 \n';
    _txt = _txt + 'Nós temos um site disponível aonde você pode acompanhar os pedidos realizados, tal como esse que você fez.\n';
    _txt = _txt + 'E agora?';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Quero usar!", data: "orderConfirmation_start", event: _event });
    replies.add({ text: "Ainda tenho dúvidas!", data: "orderConfirmation_question", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_startTrial = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();

    const buttons = new Buttons();
    buttons.add({ text: 'admin.pizzaibot.com', url: 'https://admin.pizzaibot.com' });

    let _txt = 'Fico feliz pela sua decisão. Basta acessar o site abaixo, clicar na opção "Continuar com o Facebook"  e configurar as informações da sua loja.';
    out.add({ text: _txt, buttons });

    return out;
}

export const m_openQuestion = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();

    let _txt = 'É uma pena que não consegui responder todas as suas dúvidas. Menos um ponto para mim. 😞\n';
    _txt = _txt + ' Pode escrever aqui então o que não ficou claro que vou mandar para um humano responder.';
    out.add({ text: _txt });

    return out;
}

export const m_confirmOpenQuestion = async (data, pageID, userID, text) => {

    await updateMktContact({ pageID, userID, text, last_answer: data });

    const out = new Elements();

    let _txt = 'Ok, recebi a sua dúvida. \
    Saiba que os humanos nem sempre estão disponíveis, mas a gente vai te responder o mais rápido possível. \
    Qual a melhor forma de te responder?';

    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Ligar Fone", data: "finalquestion_phone", event: _event });
    replies.add({ text: "Whatsapp", data: "finalquestion_whatsapp", event: _event });
    replies.add({ text: "E-mail", data: "finalquestion_mail", event: _event });
    replies.add({ text: "Messenger", data: "finalquestion_messenger", event: _event });
    out.setQuickReplies(replies);
    return out;
}

export const m_returnContact = async (data, pageID, userID, type) => {

    const out = new Elements();

    if (type === 'messenger') {
        await updateMktContact({ pageID, userID, contact_form: type, last_answer: data, final: true });

        let _txt = 'Muito bem, logo logo nosso melhor humano vai te chamar aqui no Messenger para tirar a sua dúvida tá bom? Um grande abraço.';
        out.add({ text: _txt });
    } else if (type === 'phone' || type === 'whatsapp') {
        await updateMktContact({ pageID, userID, contact_form: type, last_answer: data });

        let _txt = 'Então, por favor, pode me enviar o seu telefone para que nosso humano entre em contato?';
        out.add({ text: _txt });

        const replies = new QuickReplies();
        replies.add({ text: 'Telefone', isPhoneNumber: true, data: 'phone_number', event: _event });
        replies.add({ text: 'Digitar o telefone', data: 'type_phone', event: _event });
        out.setQuickReplies(replies);
    } else if (type === 'email') {
        await updateMktContact({ pageID, userID, contact_form: type, last_answer: data });

        let _txt = 'Então, por favor, pode digitar o seu e-mail para que nosso humano entre em contato?';
        out.add({ text: _txt });
    }
    return out;
}

export const m_typePhone = async (data, pageID, userID, validation) => {
    await updateMktContact({ pageID, userID, last_answer: data });

    const out = new Elements();

    if (data === 'retype_phone') {
        let _txt = 'Parece que há algum problema com o número que você digitou.';
        if (validation === 'INCOMPLETE_PHONE')
            _txt = _txt + 'Parece que faltou o DDD. Digite novamente por favor. Informe somente o DDD e o número.';
        else
            _txt = _txt + 'Digite novamente por favor. Informe somente o DDD e o número.';
        out.add({ text: _txt });
    } else {
        let _txt = 'Por favor, pode digitar o seu telefone:';
        out.add({ text: _txt });
    }


    return out;
}

export const m_isValidPhone = async (phone) => {

    const validation = phone.replace(/\s|-/g, "").match(/^[0-9\+]{8,13}$/);
    console.info(validation);
    if (!validation) {
        return 'INVALID_PHONE';
    } else {
        if (validation.input.length <= 9)
            return 'INCOMPLETE_PHONE';
        else
            return 'OK_PHONE';
    }
}

export const m_contactPhone = async (data, pageID, userID, phone) => {
    await updateMktContact({ pageID, userID, contact_phone: phone, last_answer: data, final: true });

    const out = new Elements();

    let _txt = 'Ok, muito obrigado. O nosso melhor humano vai entrar em contato contigo o mais breve possível. Um grande abraço da equipe Pizzaibot!';
    out.add({ text: _txt });
    return out;
}

export const m_contactMail = async (data, pageID, userID, text) => {
    await updateMktContact({ pageID, userID, contact_mail: text, last_answer: data, final: true });

    const out = new Elements();

    let _txt = 'Ok, muito obrigado. O nosso melhor humano vai entrar em contato contigo o mais breve possível. Um grande abraço da equipe Pizzaibot!';
    out.add({ text: _txt });
    return out;
}

export const m_returnedCustomer = async (data, pageID, userID) => {
    await updateMktContact({ pageID, userID, last_answer: data, final:false });

    const out = new Elements();

    let _txt = 'Olá de novo! Vi que você já passou por aqui, mas talvez queira rever algo certo? Então seguem as principais opções:';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Como funciona?", data: "options_howitworks", event: _event });
    replies.add({ text: "Quanto custa?", data: "options_howmuch", event: _event });
    replies.add({ text: "Quero testar!", data: "options_wanttest", event: _event });
    out.setQuickReplies(replies);
    return out;
}

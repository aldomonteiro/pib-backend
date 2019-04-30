import { w_controller } from '../src/api/whatsapp/whatSimpleController';

test('w_controller return text first response', async () => {
    const message = {
        contactName: 'Aline Marius',
        message: 'olá',
        msgType: 'chat',
        myId: '554499485760',
        profileImg: 'https://web.whatsapp.com/pp?e=https%3A%2F%2Fpps.whatsapp.net%2Fv%2Ft61.24694-24%2F55964157_2387221004655908_692256794340229120_n.jpg%3Foe%3D5CC89587%26oh%3D0bf8a8933309f3a364901d9d3cde4b27&t=s&u=554196411476%40c.us&i=1551635140',
        userId: '554111111111@c.us',
    }

    const data = await w_controller(message);
    expect(data.type).toBe('text');
});

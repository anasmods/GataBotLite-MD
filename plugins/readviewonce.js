let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));

let handler = async (m, { conn }) => {
    let quoted = m.quoted;

    
    if (!quoted) return conn.reply(m.chat, `*Responde a un mensaje de una sola vez "ViewOnce" para ver su contenido.*`, m);
    
   
    let viewOnceMessage = quoted.viewOnce ? quoted : 
        quoted.mediaMessage?.imageMessage || 
        quoted.mediaMessage?.videoMessage || 
        quoted.mediaMessage?.audioMessage;

    if (!viewOnceMessage) return conn.reply(m.chat, `❌ No es un mensaje de imagen, video o audio ViewOnce.`, m);

    
    let buffer = await viewOnceMessage.download?.(false);
    if (!buffer) return conn.reply(m.chat, `❌ No se pudo descargar el contenido.`, m);

    let messageType = viewOnceMessage.mimetype || quoted.mtype;

    if (messageType.includes('video')) {
        await conn.sendMessage(m.chat, { video: buffer, caption: viewOnceMessage.caption || '', mimetype: 'video/mp4' }, { quoted: m });

    } else if (messageType.includes('image')) {
        await conn.sendMessage(m.chat, { image: buffer, caption: viewOnceMessage.caption || '' }, { quoted: m });

    } else if (messageType.includes('audio')) {
        await conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4', ptt: false }, { quoted: m });

    } else {
        return conn.reply(m.chat, `❌ No es un mensaje de imagen, video o audio ViewOnce.`, m);
    }
};

handler.command = ['readviewonce', 'read', 'viewonce', 'ver'];
handler.register = true;

export default handler;

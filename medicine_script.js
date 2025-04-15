require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { schedule } = require('node-cron');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const localeData = require('dayjs/plugin/localeData');

dayjs.extend(duration);
dayjs.extend(localeData);
dayjs.locale('pt-br');

const VICK_NUMBER = process.env.VICK_NUMBER;
const FELIPPE_NUMBER = process.env.FELIPPE_NUMBER;
const GREAT_DAY = dayjs('2025-03-01');

const trocadilhos = [
  'Não esquece, senão quem vai crescer é a nossa família 😂',
  'Toma ele, senão daqui a 9 meses temos um mini-nós 👶',
  'Lembra que um esquecimento hoje vira uma fralda amanhã! 🍼',
  'Se esquecer, o bebê já tem nome: Surpresinha 💥',
  'O remédio é pequeno, mas o resultado pode ser gigante 😅',
  'Uma cápsula agora ou um berço depois? Você decide! 😬',
  'Tomar o remédio é mais fácil que aprender a trocar fralda kkk 👶',
  'É só um comprimido, mas evita nove meses de surpresas 🤭',
  'Pílula: R$ 20. Fralda: R$ 80 por mês. Faça a matemática! 📊',
  'Não vamos deixar a cegonha fazer delivery hoje 🕊️',
  'O único positivo que quero ver é o seu sorriso, não um teste 😂',
  'Remedinho hoje ou chá de bebê daqui a uns meses? ☕🍼',
  "Temos planos, mas acho que 'bebê surpresa' não era um deles 😅",
  'Você toma o remédio e eu cuido de te mimar 💖',
  'Se você esquecer, já encomendo o bercinho 😳',
  'Evitar agora pra não ter que explicar pra sua mãe depois 🤫',
  'O amor pode crescer, mas o útero não precisa acompanhar! 😂',
  'Toma aí que o único neném da casa sou eu 🥹',
  'Sem remédio = com ultrassom. Seu corpo, sua escolha… mas só lembrando! 😅',
  'Uma dose de prevenção vale mais que um enxoval inteiro! 👗🧸',
  'Cuidado! O esquecimento pode gerar choros de 3h da manhã 👶',
  'Remédio hoje = liberdade amanhã. Não se esquece! 😉',
  'O bebê pode ser fofo, mas o sono perdido não é! 😴',
  'Cada comprimido é uma fralda a menos no futuro 😂',
  'Esqueceu? Já vou praticar minhas cantigas de ninar então 🎵',
  'Já mandei currículo pra babá, só por precaução 👶📝',
  'Tomar remédio hoje = manter a paz doméstica amanhã 🕊️',
  'A cegonha tá on, cuidado! 🕊️',
  'Pílula salva-relacionamento — científica e emocionalmente kkk 🤓',
  'O bebê vai ser lindo, mas vamos planejar, né? 😬',
  'Mais barato que comprar mamadeira! 🍼💸',
  'Não quero dividir sua atenção com um bebê agora 🥹',
  'Já avisou a sua mãe que pode virar vó? Então toma o remédio 😅',
  'Se esquecer, eu já escolhi o nome: Amorim Júnior 💖👶',
];

const formatDate = () => {
  const start = dayjs(GREAT_DAY);
  const end = dayjs();
  const diff = dayjs.duration(end.diff(start));

  const years = diff.years();
  const months = diff.months();
  const days = diff.days();

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);

  return parts.length === 3
    ? `${years}, ${months} e ${days}`
    : parts.join(' e ');
};

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'medicine_reminder',
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.once('ready', () => {
  console.log('Client is ready!');

  schedule('0 18 * * *', () => {
    client.sendMessage(VICK_NUMBER, 'Você já tomou seu remédio hoje? 🍼❌');
  });

  schedule('5 18 * * *', () => {
    const random = Math.floor(Math.random() * trocadilhos.length);
    client.sendMessage(VICK_NUMBER, trocadilhos[random]);
  });
});

client.on('message_create', (message) => {
  if (message.body.toLocaleLowerCase() === 'ping')
    client.sendMessage(message.from, 'pong');
  if (
    message.body.toLowerCase().includes('tempo de namoro') &&
    (message.from === VICK_NUMBER || message.to === FELIPPE_NUMBER)
  )
    client.sendMessage(
      message.from,
      `Felippe e Vitória tem ${formatDate()} de namoro! ❤️`
    );
});

client.initialize();

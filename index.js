console.log(1);

var string = 'Privet';
var nomer = 69;
var shtoto = false;

var variable = 5;
variable = "текст";
variable = true;
var empty = null;
function show() {
    console.log("...");
}
show();

var count = 0;
console.log(count);
count = 99;
console.log(count);

var a = 25;
var b = 4;
var sum = a + b;
if (sum % 2 === 0) {
    console.log("Число " + sum + " чётное");
}
if (sum % 2 != 0) {
    console.log("Число " + sum + " нечётное");
}

var sc = 0;
sc += 1;
sc += 1;
sc += 1;
sc -= 1;
sc -= 1;
console.log(sc);

var wallet = 1000;
wallet += 200;
wallet *= 0.7;
wallet /= 2;
console.log(wallet);

var speed = 80;
var isRoadClear = false;
if (speed <= 60 || !isRoadClear) {
    console.log('Можно ехать');
}
if (speed >= 80 && isRoadClear) {
    console.log('Опасно');
}

var hk = true;
var knowsPassword = false;
if (hk && knowsPassword) {
    console.log("Полный доступ");
}
if ((hk && !knowsPassword) || (!hk && knowsPassword)) {
    console.log("Ограниченный доступ");
}
if (!hk && !knowsPassword) {
    console.log("Доступ запрещён");
}

var sum1 = 0;
for (var i = 1; i <= 10; i++) {
    sum1 += i;
}
console.log(sum1);

var A = 5;
var res = 1;
for (var i = 1; i <= 10; i++) {
    res = A * i;
    console.log(A + "×" + i + "=" + res);
}

var n = 6;
var fac = 1;
for (var i = 1; i <= n; i++) {
    fac *= i;
}
console.log(fac);

//practic functions
//1
function add(a, b) {
    return a + b;
}
console.log(add(12, 2));
console.log(add(34, 35));
console.log(add(-34, 37));
//2
function greet(name) {
    if (name === void 0) { name = "name"; }
    console.log("еу, " + name + "!");
}
greet("...");
//3
function isEven(num) {
    return num % 2 === 0;
}
console.log(isEven(7));
console.log(isEven(8));
//4
function sq(num) {
    return num * num;
}
console.log(sq(5));
console.log(sq(10));
//5
function sravn(a, b) {
    if (a > b) {
        return "первое число больше";
    }
    if (b > a) {
        return "второе число больше";
    }
    return "равны";
}
console.log(sravn(13, 28));
console.log(sravn(4, 15));
console.log(sravn(33, 4));

//д/з
var Age = 17;
if (Age < 18) {
    console.log('нет доступа!');
}
if (Age >= 18) {
    console.log('доступ есть!');
    for (var i = 1; i <= 10; i++) {
        console.log(Age + ' x ' + i, '= ' + Age * i);
    }
}
//д/з 2
function calculator(a, b, c) {
    if (c === '+') {
        return a + b;
    }
    if (c === '-') {
        return a - b;
    }
    if (c === '*') {
        return a * b;
    }
    if (c === '/') {
        return a / b;
    }
    return 0;
}
console.log('12 + 21 = ',
    calculator(12, 21, '+'));
console.log('3 - 23 = ',
    calculator(3, 23, '-'));
console.log('4 × 11 = ',
    calculator(4, 11, '*'));
console.log('45 ÷ 23 = ',
    calculator(45, 23, '/'));
//
//1
const names = ['ivan', 'petr', 'sidor'];
const ages = [25, 30, 35];
const flags = [false, true, false];

//2
const vegetables = ['помидор', 'огурец', 'морковь'];
console.log(vegetables[0]);
console.log(vegetables[2]);

//3
const movie = {
    title: 'альфа',
    director: 'Иванов А В',
    year: 1995
};
console.log('Фильм:', movie);
console.log('Название:', movie.title);
console.log('Режиссер:', movie.director);
console.log('Год:', movie.year);

//4
const client = {
    name: 'Максим',
    age: 28
};
console.log(client);

//5
const employees = [
    { name: 'анна', age: 25 },
    { name: 'михаил', age: 30 },
    { name: 'елена', age: 28 },
];
for (let i = 0; i < employees.length; i++) {
    console.log('Имя: ' + employees[i].name + ', Возраст: ' + employees[i].age);
}

//6
const digits = [5, 6, 7];
digits.push(8);
console.log(digits);

//7
const values = [2, 3, 4, 5];
const multiplied = values.map((val) => val * 5);
console.log(multiplied);

//8
const userAges = [15, 25, 17, 40, 16];
const mature = userAges.filter((age) => age >= 18);
console.log(mature);

//9
const customers = [
    { name: 'анна', age: 25 },
    { name: 'михаил', age: 30 },
    { name: 'елена', age: 28 },
];
const searchName = 'михаил';
const foundUser = customers.find((u) => u.name === searchName);
if (foundUser) {
    console.log('Найден: ' + foundUser.name + ', ' + foundUser.age + ' лет');
}
if (!foundUser) {
    console.log('Пользователь не найден');
}

//10
const mixedNumbers = [5, -3, 15, 0, 8, -1];
const positiveDoubled = mixedNumbers.filter((num) => num > 0).map((num) => num * 3);
console.log(positiveDoubled);

//11
const unsorted = [45, 8, 12, 3];
const defaultSort = [...unsorted].sort();
console.log('По умолчанию:', defaultSort);
const ascending = [...unsorted].sort((a, b) => a - b);
console.log('Возрастание:', ascending);
const descending = [...unsorted].sort((a, b) => b - a);
console.log('Убывание:', descending);
//
//
//1
const productList = [
    { name: 'Ноутбук', price: 50000, inStock: true },
    { name: 'Мышь', price: 1500, inStock: false },
    { name: 'Клавиатура', price: 3000, inStock: true },
    { name: 'Монитор', price: 20000, inStock: true },
    { name: 'Наушники', price: 5000, inStock: false }
];

const availableItems = productList.filter(product => product.inStock);
console.log('Товары в наличии:');
availableItems.forEach(product => {
    console.log(`- ${product.name}: ${product.price} руб.`);
});

const prices = availableItems.map(product => product.price);
console.log('Цены товаров:', prices.join(', '));

let total = 0;
for (let i = 0; i < availableItems.length; i++) {
    total += availableItems[i].price;
}
console.log(`Общая стоимость: ${total} руб.`);

const byPrice = [...availableItems].sort((first, second) => first.price - second.price);
console.log('Сортировка по цене:');
byPrice.forEach(product => {
    console.log(`- ${product.name}: ${product.price} руб.`);
});
//
//
async function obtainBlogEntries() {
    try {
        const serverResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!serverResponse.ok) {
            throw new Error(`Проблема с соединением: ${serverResponse.status}`);
        }
        const entries = await serverResponse.json();
        return entries;
    } catch (error) {
        console.error('Сбой при получении записей:', error);
        return [];
    }
}

async function obtainEntryById(entryNumber) {
    try {
        const serverResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${entryNumber}`);
        if (!serverResponse.ok) {
            throw new Error(`Проблема с соединением: ${serverResponse.status}`);
        }
        const entry = await serverResponse.json();
        return entry;
    } catch (error) {
        console.error('Ошибка получения записи:', error);
        return null;
    }
}

async function obtainCommunityMembers() {
    try {
        const serverResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!serverResponse.ok) {
            throw new Error(`Проблема с соединением: ${serverResponse.status}`);
        }
        const members = await serverResponse.json();
        return members;
    } catch (error) {
        console.error('Не удалось загрузить участников:', error);
        return [];
    }
}

async function runApplication() {
    console.log('>>>>> ЗАПИСИ БЛОГА');
    const blogEntries = await obtainBlogEntries();
    
    if (blogEntries.length > 0) {
        const firstEntry = blogEntries[0];
        console.log('Начальная запись:');
        console.log('Номер:', firstEntry.id);
        console.log('Заголовок:', firstEntry.title);
        console.log('Текст записи:', firstEntry.body);
        console.log('---');
    }

    console.log('>>>>> ЗАПРОС ЗАПИСИ ПО НОМЕРУ');
    const entryById = await obtainEntryById(1);
    if (entryById) {
        console.log('Запись номер 1:', entryById.title);
    }
    console.log('---');

    console.log('>>>>> УЧАСТНИКИ С ДЛИННЫМИ ИМЕНАМИ');
    const communityMembers = await obtainCommunityMembers();
    const membersWithLongNames = communityMembers.filter(member => member.name.length > 10);
    membersWithLongNames.forEach(member => {
        console.log('Участник:', member.name);
    });
    console.log('---');

    console.log('>>>>> СОДЕРЖАНИЕ ЗАПИСЕЙ');
    const allEntries = await obtainBlogEntries();
    const entryContents = allEntries.map(entry => entry.body);
    console.log('Содержание записей:', entryContents);
    console.log('---');

    console.log('>>>>> ПОИСК ЗАПИСИ ПО ЗАГОЛОВКУ');
    const foundEntry = allEntries.find(entry => entry.title === "qui est esse");
    if (foundEntry) {
        console.log('Найдена запись:');
        console.log('Номер:', foundEntry.id);
        console.log('Заголовок:', foundEntry.title);
        console.log('Содержание:', foundEntry.body);
    } else {
        console.log('Запись отсутствует в каталоге');
    }
}

runApplication();
//
async function getBlogPosts() {
    try {
        const serverResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const postsData = await serverResponse.json();
        return postsData;
    } catch (error) {
        console.error('Problem fetching posts data:', error);
        return [];
    }
}

async function run() {
    const allPosts = await getBlogPosts();

    const userIdentifiers = allPosts.map(post => post.userId);
    
    console.log('User IDs from all posts:');
    console.log(userIdentifiers);

    const uniqueUsers = Array.from(new Set(userIdentifiers));
    console.log('Unique user IDs:');
    console.log(uniqueUsers);

    console.log('User ID for each post:');
    userIdentifiers.forEach((userId, index) => {
        console.log(`Post ${index + 1} belongs to user ${userId}`);
    });

    console.log(`Summary:
    Posts processed: ${allPosts.length}
    Different users: ${uniqueUsers.length}
    Most active user: ${uniqueUsers.reduce((a, b) => 
        userIdentifiers.filter(id => id === a).length > userIdentifiers.filter(id => id === b).length ? a : b
    )}`);
}
run();
//
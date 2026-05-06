console.log(1)

let string: string ='Privet';
let nomer: number=69; 
let shtoto: boolean=false;

let variable: any = 5;
variable = "текст";
variable = true;
let empty: null = null;
function show(): void{
    console.log("...");
}
show();

let count: number=0;
console.log(count);
count=99;
console.log(count);

let a: number = 25;
let b: number = 4;
let sum: number = a + b;
if (sum%2===0) {
    console.log("Число " + sum + " чётное");
}
if (sum%2!=0) {
    console.log("Число " + sum + " нечётное");
}

let sc: number=0;
sc+=1;
sc+=1;
sc+=1;
sc-=1;
sc-=1;
console.log(sc);
// C)
let wallet: number=1000;
wallet+=200;
wallet*=0.7;
wallet/=2;
console.log(wallet);

const speed: number=80;
const isRoadClear: boolean=false;
if (speed<=60||!isRoadClear){
console.log('Можно ехать');
}
if (speed>=80 && isRoadClear) {
console.log('Опасно');
}

let hk: boolean = true;
let knowsPassword: boolean = false;
if (hk&&knowsPassword) {
    console.log("Полный доступ");
}
if ((hk&&!knowsPassword)||(!hk&&knowsPassword)){
    console.log("Ограниченный доступ");
}
if (!hk&&!knowsPassword){
    console.log("Доступ запрещён");
}

let sum1=0;
for (let i=1;i<=10;i++){
    sum1+=i;
}
console.log(sum1);

let A=5;
let res=1;
for (let i=1;i<=10;i++){
    res=A*i;
    console.log(A+"×"+i+"="+res);
}

let n=6;
let fac=1;
for (let i=1;i<=n;i++){
    fac*=i;
}
console.log(fac);

// Практика Функции
//1
function add(a:number,b:number):number{
    return a + b;
}
console.log(add(12, 2));
console.log(add(34, 35));
console.log(add(-34, 37));

//2
function greet(name: string = "name") {
    console.log("еу, " + name + "!");
}
greet("...");

//3
function isEven(num:number):boolean{
    return num%2===0;
}
console.log(isEven(7));
console.log(isEven(8));

//4
function sq(num:number):number{
    return num*num;
}
console.log(sq(5));
console.log(sq(10));

//5
function sravn(a: number, b: number): string {
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
let Age:number=17; 
if (Age<18){
    console.log('нет доступа!');
}
if (Age>=18){
    console.log('доступ есть!');
    for (let i=1;i<=10;i++){
        console.log(Age+' x '+i,'= '+Age*i);
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
const names: string[] = ['ivan', 'petr', 'sidor'];
const ages: number[] = [25, 30, 35];
const flags: boolean[] = [false, true, false];

//2
const vegetables: string[] = ['помидор', 'огурец', 'морковь'];
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
type Client = {
    name: string;
    age: number;
}
const client: Client = {
    name: 'Максим',
    age: 28
}
console.log(client);

//5
interface Employee {
    name: string;
    age: number;
}
const employees: Employee[] = [
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
interface Customer {
    name: string;
    age: number;
}
const customers: Customer[] = [
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
type ProductItem = {
    name: string;
    price: number;
    inStock: boolean;
};

//2
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
type BlogPost = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

type SiteUser = {
    id: number;
    name: string;
    username: string;
    email: string;
};

async function fetchBlogPosts(): Promise<BlogPost[]> {
    try {
        const apiResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!apiResponse.ok) {
            throw new Error(`Ошибка API: ${apiResponse.status}`);
        }
        const publications: BlogPost[] = await apiResponse.json();
        return publications;
    } catch (err) {
        console.error('Не удалось загрузить публикации:', err);
        return [];
    }
}

async function getPublicationById(publicationId: number): Promise<BlogPost | null> {
    try {
        const apiResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${publicationId}`);
        if (!apiResponse.ok) {
            throw new Error(`Ошибка API: ${apiResponse.status}`);
        }
        const publication: BlogPost = await apiResponse.json();
        return publication;
    } catch (err) {
        console.error('Ошибка получения публикации:', err);
        return null;
    }
}

async function fetchSiteUsers(): Promise<SiteUser[]> {
    try {
        const apiResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!apiResponse.ok) {
            throw new Error(`Ошибка API: ${apiResponse.status}`);
        }
        const userList: SiteUser[] = await apiResponse.json();
        return userList;
    } catch (err) {
        console.error('Не удалось загрузить пользователей:', err);
        return [];
    }
}

async function executeProgram() {
    console.log('>>> ЗАГРУЗКА ПУБЛИКАЦИЙ');
    const publications = await fetchBlogPosts();
    
    if (publications.length > 0) {
        const initialPublication = publications[0];
        console.log('Первая публикация:');
        console.log('Идентификатор:', initialPublication.id);
        console.log('Название:', initialPublication.title);
        console.log('Содержание:', initialPublication.body);
        console.log('---');
    }

    console.log('>>> ПОЛУЧЕНИЕ ПУБЛИКАЦИИ ПО ИДЕНТИФИКАТОРУ');
    const specificPublication = await getPublicationById(1);
    if (specificPublication) {
        console.log('Публикация #1:', specificPublication.title);
    }
    console.log('---');

    console.log('>>> ПОЛЬЗОВАТЕЛИ С ДЛИННЫМИ ИМЕНАМИ');
    const userList = await fetchSiteUsers();
    const filteredUsers = userList.filter(user => user.name.length > 10);
    filteredUsers.forEach(user => {
        console.log('Пользователь:', user.name);
    });
    console.log('---');

    console.log('>>> ТЕКСТЫ ПУБЛИКАЦИЙ');
    const allPublications = await fetchBlogPosts();
    const publicationTexts = allPublications.map(publication => publication.body);
    console.log('Все тексты:', publicationTexts);
    console.log('---');

    console.log('>>> ПОИСК КОНКРЕТНОЙ ПУБЛИКАЦИИ');
    const searchedPublication = allPublications.find(publication => publication.title === "qui est esse");
    if (searchedPublication) {
        console.log('Результат поиска:');
        console.log('ID:', searchedPublication.id);
        console.log('Заголовок:', searchedPublication.title);
        console.log('Текст:', searchedPublication.body);
    } else {
        console.log('Публикация не найдена в базе');
    }
}

executeProgram();
//
type BlogEntry = {
    authorId: number;
    entryId: number;
    heading: string;
    content: string;
};

async function fetchBlogEntries(): Promise<BlogEntry[]> {
    try {
        const apiResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const entries: BlogEntry[] = await apiResponse.json();
        return entries;
    } catch (err) {
        console.error('Failed to retrieve blog entries:', err);
        return [];
    }
}

async function execute() {
    const blogEntries = await fetchBlogEntries();

    const authorIdentifiers = blogEntries.map(entry => entry.authorId);
    
    console.log('Author identifiers found in blog entries:');
    console.log(authorIdentifiers);

    const distinctAuthors = [...new Set(authorIdentifiers)];
    console.log('Distinct author identifiers:');
    console.log(distinctAuthors.sort((a, b) => a - b));

    console.log('Detailed author list:');
    authorIdentifiers.forEach((authorId, position) => {
        console.log(`Entry ${position + 1} → Author: ${authorId}`);
    });

    console.log(`Statistics:
    Total entries: ${blogEntries.length}
    Unique authors: ${distinctAuthors.length}
    Author distribution: ${distinctAuthors.map(id => `${id}(${authorIdentifiers.filter(aid => aid === id).length})`).join(', ')}`);
}
execute();
//
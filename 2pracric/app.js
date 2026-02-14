const express = require('express');
const app = express();
const port = 3000;

// Массив товаров
let products = [
    {id: 1, name: 'Телефон', price: 15000},
    {id: 2, name: 'Ноутбук', price: 50000},
    {id: 3, name: 'Наушники', price: 3000},
];

// Middleware для парсинга JSON
app.use(express.json());

// Главная страница
app.get('/', (req, res) => {
	res.send('Главная страница');
});

// CRUD операции для товаров

// 1. Получение всех товаров
app.get('/products', (req, res) => {
	res.json(products);
});

// 2. Получение товара по id
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
	res.json(product);
});

// 3. Добавление нового товара
app.post('/products', (req, res) => {
	const { name, price } = req.body;

    // Валидация входных данных
    if (!name || price === undefined) {
        return res.status(400).json({ message: 'Необходимо указать название и стоимость товара' });
    }

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'Стоимость должна быть положительным числом' });
    }

    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 4. Редактирование товара
app.patch('/products/:id', (req, res) => {
	const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    const { name, price } = req.body;

    // Валидация входных данных
    if (name !== undefined && typeof name !== 'string') {
        return res.status(400).json({ message: 'Название должно быть строкой' });
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ message: 'Стоимость должна быть положительным числом' });
    }

    // Обновление полей
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;

    res.json(product);
});

// 5. Удаление товара
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.id);
    
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    products.splice(productIndex, 1);
	res.json({ message: 'Товар успешно удален' });
});

// Запуск сервера
app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});
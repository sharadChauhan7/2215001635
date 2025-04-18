const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.get('/', (req, res) => {
    res.send("Server is nnnn");
}
);

app.post('/averageCalci', (req, res) => {
    const numbers = req.body.numbers;

    if (!Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({ error: "Empty data" });
    }

    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        if (typeof numbers[i] !== 'number') {
            return res.status(400).json({ error: "All elements must be number." });
        }
        sum += numbers[i]; // i have finded total sum
    }

    const average_of_numbers = sum / numbers.length; // average formula

    res.json({ average_of_numbers: average_of_numbers });
});

app.listen(PORT, () => {
    console.log(`Server running at PORT${PORT}`);
});
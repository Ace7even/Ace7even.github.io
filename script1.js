// Функция для удаления строки из таблицы
function deleteRow(event) {
    const row = event.target.parentNode.parentNode; // Получаем строку, содержащую кнопку
    row.parentNode.removeChild(row); // Удаляем эту строку из таблицы
    saveTicketsToLocalStorage(); // Сохраняем изменения в локальное хранилище
    calculateTotalCost(); // Пересчитываем общую стоимость после удаления строки
}

// Функция для обработки отправки формы
function handleSubmit(event) {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию

    // Получаем значения из формы
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    // Проверяем, чтобы значения "Откуда" и "Куда" не совпадали
    if (origin === destination) {
        alert('Город отправления и прибытия не могут совпадать!');
        return; // Прерываем выполнение функции, если города совпадают
    }
    
    // Создаем новую строку в таблице
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${origin}</td>
        <td>${destination}</td>
        <td>${price}</td>
        <td>${quantity}</td>
        <td><button class="deleteButton">Удалить</button></td> <!-- Кнопка удаления -->
    `;

    // Добавляем обработчик события для кнопки удаления
    row.querySelector('.deleteButton').addEventListener('click', deleteRow);

    // Добавляем строку в таблицу
    document.getElementById('ticketTable').querySelector('tbody').appendChild(row);

    // Очищаем форму после добавления строки
    document.getElementById('ticketForm').reset();

    // Сохраняем данные в локальное хранилище
    saveTicketsToLocalStorage();

    // Пересчитываем общую стоимость
    calculateTotalCost();
}



// Функция для сохранения данных в локальное хранилище
function saveTicketsToLocalStorage() {
    const tickets = [];
    const rows = document.getElementById('ticketTable').querySelectorAll('tbody tr');
    rows.forEach(row => {
        const ticket = {
            origin: row.cells[0].textContent,
            destination: row.cells[1].textContent,
            price: parseFloat(row.cells[2].textContent),
            quantity: parseInt(row.cells[3].textContent),

        };
        tickets.push(ticket);
    });
    localStorage.setItem('tickets', JSON.stringify(tickets));
}

// Обработчик события отправки формы
document.getElementById('ticketForm').addEventListener('submit', handleSubmit);

// Обработчик события клика на кнопку экспорта в JSON
document.getElementById('exportButton').addEventListener('click', function() {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const jsonData = JSON.stringify(tickets, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tickets.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Загружаем данные из локального хранилища при загрузке страницы
window.onload = function() {
    const savedTickets = JSON.parse(localStorage.getItem('tickets')) || [];
    savedTickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.origin}</td>
            <td>${ticket.destination}</td>
            <td>${ticket.price}</td>
            <td>${ticket.quantity}</td>
            <td><button class="deleteButton">Удалить</button></td> <!-- Кнопка удаления -->
        `;
        document.getElementById('ticketTable').querySelector('tbody').appendChild(row);
        row.querySelector('.deleteButton').addEventListener('click', deleteRow);
    });
    
    
};

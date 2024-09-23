'use strict';
const account1 = {
  owner: 'Kushagra Anshu',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Mayank Kumar',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Rajveer Singh',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Priyanka Anand',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//MAIN CODE

containerMovements.innerHTML = ``;
const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = ``;
  // clears existing html
  movs.forEach(function (mov, i) {
    const type = mov >= 0 ? `deposit` : `withdrawal`;
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}Rs</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};
displayMovements(account1.movements);

/////
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

const creatingUserNames = function (accs) {
  accs.forEach(function (acc) {
    //acc means the each element of the of the account array
    acc.userName = acc.owner
      .toLowerCase()
      .split(` `)
      .map(name => name[0])
      .join(``);
  });
};
creatingUserNames(accounts);

/////

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}Rs`;

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}Rs`;
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, mov) => accumulator + mov,
    0
  );
  labelBalance.textContent = `${acc.balance} Rs`;
};

// EVENT HANDLER
let currentAccount;
btnLogin.addEventListener(`click`, function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;

    // clear the input fields
    // inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginUsername.value = ``;
    inputLoginPin.value = ``;
    inputLoginPin.blur();
    // Update UI

    updateUI(currentAccount);
  }
});

//Implementing Transfer
btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciverAcc?.userName != currentAccount.userName
  ) {
    //Doing the Transfer
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateUI(currentAccount);
  } else {
    alert('The balance is insufficient !');
  }
  inputTransferTo.value = ``;
  inputTransferAmount.value = ``;
});

// Request a loan
btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = ``;
});

// Close Account

btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = ``;
  inputClosePin.value = ``;
});



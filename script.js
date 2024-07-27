'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
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
const labelTimer = document.querySelector('.timer');
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

// containerMovements.innerHTML = ``;
const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = ``;
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
// displayMovements(account1.movements);

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

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}Rs`;
};
// calcDisplaySummary(account1.movements);

////

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, mov) => accumulator + mov,
    0
  );
  labelBalance.textContent = `${acc.balance} Rs`;
};
// calcDisplayBalance(account1.movements);
//fn is called under the login function

// EVENT HANDLER
let currentAccount;
btnLogin.addEventListener(`click`, function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

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
  console.log(amount, reciverAcc);
  if (
    amount > 0 &&
    // receiverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.userName != currentAccount.userName
  ) {
    //Doing the Transfer
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
  inputTransferTo.value = ``;
  inputTransferAmount.value = ``;
});

// Request a loan
btnLoan,
  addEventListener(`click`, function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if (
      amount > 0 &&
      currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
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

// Sorting the balance
let sorted = false;
btnSort.addEventListener(`click`, function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// sort(currentAccount.movements);

//
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = [`a`, `b`, `c`, `d`, `e`];
// arr.slice(2);
// console.log(arr.slice(3));
// console.log([...arr]);

// const arr2 = [`j`, `i`, `h`, `g`, `f`];
// console.log(arr2.reverse());
// const letters = arr2.concat(arr);
// // console.log(letters);
// console.log([...arr, ...arr2]);
// // console.log(letteRslength);

// const arr = [23, 11, 64];
// console.log(arr.at(2));
// console.log(arr.at(arr.length - 1));
// console.log(`jonas`.at(0));

// //for each method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const Elements of movements) {
//   if (Elements > 0) {
//     console.log(Elements);
//   }
// }

// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(movement);
//   }
// });

// // FOR EACH METHOD WITH A MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// currencies.forEach(function (value, key, map) {
//   console.log(map);
//   console.log(`${key}:${value}`);
// });

// //NOW WITH A SET
// const currenciesUnique = new Set([`USD`, `GBP`, `USD`, `EUR`, `EUR`]);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}:${value}`);
//   console.log(map);
//   console.log(currenciesUnique);
// });

//  CODING CHALLENGE 1 //

// const checkDogs = function (dogsJulia, dogsKate) {
//   const newdogsJulia = dogsJulia.slice();
//   newdogsJulia.splice(0, 1);
//   newdogsJulia.splice(-2);

//   const dogs = newdogsJulia.concat(dogsKate);
//   console.log(dogs);
//   dogs.forEach(function (dog, i) {
//     dog >= 3
//       ? console.log(`Dog number ${i + 1} is an adult , and is ${dog} years old`)
//       : console.log(`Dog number ${i + 1} is still a puppy`);
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// // THE MAP METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;
// const movementToUsd = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
// console.log(movements);
// console.log(movementToUsd);

// // FOR-OF LOOP(ANOTHER METHOD)

// const movementtoUsdfor = [];
// // for (const mov of movements) {
// //   movementtoUsdfor.push(mov * eurToUsd);
// // }
// // console.log(movementtoUsdfor);

// // ARROW FUNCTION

// const movementtoUsdarrow = mov => movementtoUsdfor.push(mov * eurToUsd);
// console.log(movementToUsd);

// const movementsDescription = movements.map((mov, i) => {
//   ` Movement ${i + 1} : You ${mov > 0 ? `deposited` : `withdrew`} ${Math.abs(
//     mov
//   )}`;

//   // if (mov > 0) {
//   //   return `Movement ${i + 1} : You deposited ${mov} : `;
//   // } else {
//   //   return `Movement ${i + 1} : You withdrew ${Math.abs(mov)}`;
//   // }
// });
// console.log(movementsDescription);

//THE FILTER METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const depositsfor = [];
// for (const mov of movements)
//   if (mov > 0) {
//     depositsfor.push(mov);
//   }
// console.log(depositsfor);

// const withdrawalfor = [];
// for (const mov of movements)
//   if (mov < 0) {
//     withdrawalfor.push(mov);
//   }
// console.log(withdrawalfor);

// // console.log(mov);

// const withdrawalfilter = movements.filter(mov => mov < 0);
// console.log(withdrawalfilter);

//  The Reduce Method

// const balance = movements.reduce(function (accumulator, current, i, arr) {
//   console.log(`Iteration ${i}:${accumulator}`);
//   return accumulator + current;
// }, 0);
// console.log(balance);

// let acc = 0;
// for (const element of movements) {
//   acc = acc + element;
// }
// console.log(acc);

// let acc2 = 0;
// movements.forEach(element => (acc2 += element));
// console.log(acc2);

// let accumulator = 0;
// const balance = movements.reduce((accumulator, current) => {
//   console.log(`Iteration ${i}:${accumulator}`);
//   return accumulator + current;
// });
// console.log(balance);

// MAXIMUM VALUE (Reduce Method )

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);

//  CODING CHALLENGE 2  //

// const calcAverageHumanAge = ages => {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);
//   const adults = humanAges.filter(element => element > 18);
//   console.log(adults);

//   const sum = adults.reduce((accumulator, age) => (accumulator += age));
//   console.log(sum);
//   const average = sum / adults.length;
//   console.log(average);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

//THE CHAINING METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //
// const eurToUsd = 1.1;
// const total = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(total);

//CODING CHALLENGE 3 //

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(element => element > 18)
//     .reduce((accumulator, age, i, arr) => (accumulator += age / arr.length), 0);
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// THE FIND METHOD //

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// console.log(accounts);
// const account = accounts.find(acc => acc.owner === `Jessica Davis`);
// console.log(account);

// for (const element of accounts) {
//   if (element.owner === `Jessica Davis`) console.log(element);
// }

// const str = `Kushagra is the gentlemen`;
// console.log(str.split(` `));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements.includes(-1300));

// //Some  method--If any one  element in an array passes the condition then it return true

// const anyDeposits = movements.some(mov => mov > 1000);
// console.log(anyDeposits);

// //Every Method -- If every element in an array passes the condition then it return true

// console.log(account4.movements.every(mov => mov > 0));

//Seperate callback

// const deposits = mov => mov > 0;
// console.log(movements.some(deposits));
// console.log(movements.every(deposits));

// // Flat  method

// const arr = [[1, 2, 3], [4, 5, 6], 7];
// console.log(arr.flat());
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7];
// console.log(arrDeep.flat(2));

// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// //FlatMap Method (combines the flat and ma method)

// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// Sorting Arrays

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// movements.sort((a, b) => {
//   a - b;
// return a > b ? 1 : -1;
// if (a > b) return 1;
// if (a < b) return -1;
// });
// console.log(movements);

//  Logic for comparison
// a-b <0 ...a comes first
// a-b >0 ...b comes first
// a-b =0 ... nothing will change

// Empty arrays + fill method

const x = [1, 2, 3, 4, 5, 6, 7];
x.fill(23, 2, 6); // first->element to filled  second->starting index  third->last index
console.log(x);

// Array.from method

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1); //(Here the current element is not req but we need to defined something and so instead of the (cur) we can also pass an (underscore) there which is something easy to understand )
console.log(z);

// Array to generate 100 random dice rolls .

// const t = Array.from({ length: 100 }, (_, i) => {
//   return (i = Math.trunc(Math.random() * 100 + 1));
// });
// console.log(t);

// labelBalance.addEventListener(`click`, function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll(`.movements__value`),
//     el => el.textContent.replace(`Rs`, ``) // passed as a second argument
//   );
//   console.log(movementsUI);
//   //   console.log(movementsUI.map(el => el.textContent.replace(`Rs`, ``)));
// });

// 1
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(element => element > 0)
  .reduce((accumulator, element) => accumulator + element, 0);
console.log(bankDepositSum);

// 2(a)
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(element => element >= 1000).length;
console.log(numDeposits1000);

//2(b)--> using reduce method
const num1Deposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, element) => (element >= 1000 ? (count += 1) : count), 0);
console.log(num1Deposits1000);

// 3--> Object type method
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, current) => {
      current > 0 ? (sums.deposits += current) : (sums.withdrawals += current);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);

// 4
const convertTitleCase = function (title) {
  // a) const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const capitalize1 = function (str) {
    str[0].toUpperCase() + str.slice(1);
    return str;
  };
  const exceptions = [`a`, `an`, `and`, `the`, `but`, `or`, `on`, `in`, `with`];
  const titleCase = title
    .toLowerCase()
    .split(` `)
    .map(word => (exceptions.includes(word) ? word : capitalize1(word)))
    .join(` `);

  return titleCase;
};
console.log(convertTitleCase(`this is a nice title`));
console.log(convertTitleCase(`AnshuKushagra LOVES JavaScript`));

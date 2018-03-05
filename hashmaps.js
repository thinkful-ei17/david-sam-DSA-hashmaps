'use strict';

class HashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i=0; i<string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Key error');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if(loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }
    const index = this._findSlot(key);
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i=start; i<start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || slot.key === key && !slot.deleted) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  containKeyCheck(key) {
    for (let i=0; i<this._slots.length; i++) {
      if (this._slots[i]) {
        if(this._slots[i].key === key) {
          return true;
        }
      }
    }
    return false;
  }

  valueEvenOrOddCheck() {
    let count = 0;
    for (let i=0; i<this._slots.length; i++) {
      if (this._slots[i]) {
        if(this._slots[i].value % 2 === 1) {
          count++;
          if (count > 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

  compilingValues(arr) {
    for (let i=0; i<this._slots.length; i++) {
      if (this._slots[i]) {
        arr.push(this._slots[i].value);
      }
    }
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function main() {
  const lor = new HashMap();
  lor.set('Hobbit', 'Bilbo');
  lor.set('Hobbit', 'Frodo');
  lor.set('Wizard', 'Gandolf');
  lor.set('Human', 'Aragon');
  lor.set('Elf', 'Legolas');
  lor.set('Maiar', 'The Necromancer');
  lor.set('Maiar', 'Sauron');
  lor.set('RingBearer', 'Gollum');
  lor.set('LadyOfLight', 'Galadriel');
  lor.set('HalfElven', 'Arwen');
  lor.set('Ent', 'Treebeard');
  // console.log(lor);
  // console.log(lor.get('Maiar'));

}

main();

// PALINDROME

// const palindromeCheck = string => {
//   const test = new HashMap();
//   for (let i=0; i<string.length; i++) {
//     if (test.containKeyCheck(string[i])) {
//       test.set(string[i], test.get(string[i]) + 1);
//     } else {
//       test.set(string[i], 1);
//     }
//   }
//   return test.valueEvenOrOddCheck();
// };

// console.log(palindromeCheck('racecar'));

// ANAGRAM

// const anagramGroup = array => {
//   const test = new HashMap();
//   const finalArr = [];
//   for (let i=0; i<array.length; i++) {
//     let sorted = [...array[i]].sort((a,b) => a.localeCompare(b)).join();
//     if (test.containKeyCheck(sorted)) {
//       test.set(sorted, [...test.get(sorted), array[i]]);
//     } else {
//       test.set(sorted, [array[i]]);
//     }
//   }
//   test.compilingValues(finalArr);
//   return finalArr;
// };

// console.log(anagramGroup(['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race']));

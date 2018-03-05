'use strict';

class HashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
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
    let slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    } else if (slot.next === null) {
      return slot.value;
    } else {
      while (slot !== null) {
        if (slot.key === key) {
          return slot.value;
        }
        slot = slot.next;
      }
    }
    
  }

  set(key, value) {
    const loadRatio = (this.length + 1) / this._capacity;
    if(loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }
    const index = this._findSlot(key);
    let slot = this._slots[index];
    const newValue = {
      key,
      value,
      deleted: false,
      next: null
    };
    if (slot === undefined || slot.deleted) {
      this._slots[index] = newValue;
    } else {
      while (slot.next !== null) {
        slot = slot.next;
      }    
      slot.next = newValue;
    }
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    let slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    } else if (slot.next === null) {
      slot.deleted = true;
    } else if (slot.key === key) {
      this._slots[index] = slot.next;
    }
    else {
      while (slot !== null) {
        if (slot.next.key === key) {
          slot.next = slot.next.next;
        }
        slot = slot.next;
      }
    }
    this.length--;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const index = hash % this._capacity;
    return index;
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && slot.next === null) {
        this.set(slot.key, slot.value);
      } else if (slot !== undefined) {
        let nestedData = slot;
        while (nestedData !== null) {
          this.set(nestedData.key, nestedData.value);
          nestedData = nestedData.next;
        }
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
  lor.set('LadyOfLight', 'Galadriel');
  lor.set('HalfElven', 'Arwen');
  lor.set('Ent', 'Treebeard');
  lor.remove('Wizard');
  lor.set('RingBearer', 'Gollum');
  console.log(lor._slots);
  console.log(lor.get('Maiar'));

}

main();
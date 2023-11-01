'use strict';

async function get(id) {
  console.log('GET', id);
}

async function create(user) {
  console.log('CREATE', user);
}

async function update(id, user) {
  console.log('UPDATE', user);
  console.log('UPDATE', id);
}

async function remove(id) {
  console.log('REMOVE', id);
}

module.exports = {
  get,
  create,
  update,
  remove
}

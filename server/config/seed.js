/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Group from '../api/group/group.model';

User.find({}).removeAsync()
  .then(() => {
    User.createAsync({
      _id: 'test00000000000000000000',
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      _id: 'admin0000000000000000000',
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then((users) => {

      Group.find({}).removeAsync()
        .then(() => {
          Group.createAsync({
            name: 'general',
            permissions: ['dataset-01', 'project-1'],
            users: [users[0]._id, users[1]._id],
            active: true
          }, {
            name: 'restricted',
            permissions: ['dataset-01'],
            users: [users[1]._id],
            active: true
          })
          .then(() => {
            console.log('finished populating groups');
          });
        });
      console.log('finished populating users');
    });
  });

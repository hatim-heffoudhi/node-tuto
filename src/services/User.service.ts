import {User} from '../model/user';

const userList: User[] = [
    {id: 0, name: {first: 'Alex', last: 'A.'}, email: 'alex@gmail.com', phoneNumbers: []},
    {id: 1, name: {first: 'Bob', last: 'B.'}, email: 'bob@gmail.com', phoneNumbers: []},
    {id: 2, name: {first: 'Chloé', last: 'C.'}, email: 'chloe@gmail.com', phoneNumbers: []},
];

export class UserService {

    list() {
        return userList;
    }

    get(id: number) {
        const userFound = userList.find(user => user.id === id);
        return Promise.resolve(userFound);
    }

    create(data: User) {
        const newUser = Object.assign({id: userList.length}, data);
        userList.push(newUser);
        return Promise.resolve(newUser);
    }

}

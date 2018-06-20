import {Body, Controller, Get, Post, Route} from 'tsoa';
import {User, UserCreationRequest} from '../model/user';
import {UserService} from "../services/User.service";
import {Inject} from "typescript-ioc";

@Route('users')
export class UsersController extends Controller {

    @Inject
    private userService : UserService;

    /**
     * Charge la liste de tous les utilisateurs.
     * @returns {Promise<User[]>}
     */
    @Get()
    public async getUsers(): Promise<User[]> {
        return await this.userService.list();
    }

    /**
     * Ajoute un nouvel utilisateur.
     * @param {UserCreationRequest} requestBody
     * @returns {Promise<User>}
     */
    // @SuccessResponse('201', 'Created') // Custom success response
    @Post()
    public async createUser(@Body() requestBody: UserCreationRequest): Promise<User> {
        const user = await this.userService.create(requestBody as User);
        this.setStatus(201); // set return status 201
        return Promise.resolve(user);
    }

    /**
     * Charge un utilisateur, d'après son identifiant.
     * @param {number} id
     * @returns {Promise<User>}
     */
    @Get('{id}')
    public async getUser(id: number): Promise<User> {
        return await this.userService.get(id);
    }

}

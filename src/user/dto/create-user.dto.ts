export class CreateUserDto {
    readonly username: string;
    readonly password: string;
    readonly nickname?: string;
}
export type UserRecordType = 'local' | 'ldap';

export interface UserRecord {
	tags: { text: string }[];
	type: UserRecordType;
	login: string;
	password: string | null;
}

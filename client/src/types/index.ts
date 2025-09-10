export enum PreferThemeEnum {
	DARK = 'dark',
	LIGHT = 'light',
	SYSTEM = 'system'
}

export type PreferThemeType = `${PreferThemeEnum}`;

export type NotificationType = `${NotificationTypeEnum}`;

export enum NotificationTypeEnum {
	SUCCESS = 'success',
	ERROR = 'error',
	INFO = 'info'
}

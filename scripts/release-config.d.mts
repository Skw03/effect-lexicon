export function resolveReleaseConfig(mode: string, directory?: string): Readonly<Record<string, string>>;
export function releaseDefines(config: Readonly<Record<string, string>>): Record<string, string>;
export function validateReleaseAssets(config: Readonly<Record<string, string>>, directory?: string): void;

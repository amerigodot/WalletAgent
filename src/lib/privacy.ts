import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'privacy_config.json');

export interface PrivacyConfig {
    useTor: boolean;
    anonymityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    dataRetention: 'SESSION' | 'PERSISTENT';
}

const DEFAULT_CONFIG: PrivacyConfig = {
    useTor: false,
    anonymityLevel: 'HIGH',
    dataRetention: 'SESSION',
};

export class PrivacyManager {
    private config: PrivacyConfig;

    constructor() {
        this.config = this.loadConfig();
    }

    private loadConfig(): PrivacyConfig {
        if (!fs.existsSync(CONFIG_PATH)) {
            this.saveConfig(DEFAULT_CONFIG);
            return { ...DEFAULT_CONFIG };
        }
        try {
            const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
            return JSON.parse(data);
        } catch {
            return { ...DEFAULT_CONFIG };
        }
    }

    private saveConfig(config: PrivacyConfig) {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    }

    getSettings(): PrivacyConfig {
        return this.config;
    }

    updateSettings(newSettings: Partial<PrivacyConfig>): PrivacyConfig {
        this.config = { ...this.config, ...newSettings };
        this.saveConfig(this.config);
        return this.config;
    }
}

export const privacy = new PrivacyManager();

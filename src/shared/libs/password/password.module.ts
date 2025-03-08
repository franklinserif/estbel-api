import { Module, DynamicModule, ModuleMetadata } from '@nestjs/common';
import { PasswordService, PASSWORD_CONFIG } from './password.service';
import { IPasswordConfig } from '@shared/interfaces/password';

export interface PasswordModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<Partial<IPasswordConfig>> | Partial<IPasswordConfig>;
  inject?: any[];
}

@Module({})
export class PasswordModule {
  static register(config: Partial<IPasswordConfig> = {}): DynamicModule {
    return {
      module: PasswordModule,
      providers: [
        {
          provide: PASSWORD_CONFIG,
          useValue: config,
        },
        PasswordService,
      ],
      exports: [PasswordService],
    };
  }

  static registerAsync(options: PasswordModuleAsyncOptions): DynamicModule {
    return {
      module: PasswordModule,
      imports: options.imports || [],
      providers: [
        {
          provide: PASSWORD_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        PasswordService,
      ],
      exports: [PasswordService],
    };
  }

  static forRoot(config: Partial<IPasswordConfig> = {}): DynamicModule {
    return {
      module: PasswordModule,
      global: true,
      providers: [
        {
          provide: PASSWORD_CONFIG,
          useValue: config,
        },
        PasswordService,
      ],
      exports: [PasswordService],
    };
  }
}

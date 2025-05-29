import { Agent } from '@veramo/core';
import { createAgent, IDIDManager, IKeyManager, IResolver, IDataStore, IDataStoreORM } from '@veramo/core';
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager';
import { KeyManager } from '@veramo/key-manager';
import { MemoryPrivateKeyStore, MemoryKeyStore } from '@veramo/key-manager';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getDidKeyResolver } from '@veramo/did-provider-key';
import { KeyDIDProvider } from '@veramo/did-provider-key';
import { CredentialPlugin, ICredentialIssuer } from '@veramo/credential-w3c';
import { KeyManagementSystem } from '@veramo/kms-local';


export const agent = createAgent<IDIDManager & IKeyManager & IResolver & ICredentialIssuer>({
    plugins: [
        new DIDManager({
            store: new MemoryDIDStore(),
            defaultProvider: 'did:key',
            providers: {
            'did:key': new KeyDIDProvider({ defaultKms: "local" }),
            },
        }),
        new KeyManager({
            store: new MemoryKeyStore(),
            kms: {local : new KeyManagementSystem(new MemoryPrivateKeyStore())},
        }),
        new CredentialPlugin(),
        new DIDResolverPlugin({
            resolver: new Resolver({ ...getDidKeyResolver() }),
        }),
    ]
})

export const issuer = await agent.didManagerCreate();
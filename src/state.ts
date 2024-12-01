import { IrcCapabilities } from "./capabilities";

export interface WhoisResponse {
    nick: string;
    user?: string;
    channels?: string[];
    host?: string;
    realname?: string;
    away?: string;
    idle?: string;
    server?: string;
    serverinfo?: string;
    operator?: string;
    account?: string;
    accountinfo?: string;
    realHost?: string;
    certfp?: string;
}

export interface IrcSupported {
    channel: {
        idlength: {[key: string]: string};
        length: number;
        limit: {[key: string]: number};
        // https://www.irc.info/articles/rpl_isupport
        modes: {
            /**
             * Always take a parameter when specified by the server.
             * May have a parameter when specificed by the client.
             */
            a: string;
            /**
             * Alwyas take a parameter.
             */
            b: string;
            /**
             * Take a parameter when set, absent when removed.
             */
            c: string;
            /**
             * Never take a parameter.
             */
            d: string;
        },
        types: string;
    };
    maxlist: {[key: string]: number};
    maxtargets:{[key: string]: number};
    modes: number;
    nicklength: number;
    topiclength: number;
    kicklength: number;
    usermodes: string;
    usermodepriority: string; // E.g "ov"
    // http://www.irc.org/tech_docs/005.html
    casemapping: 'ascii'|'rfc1459'|'strict-rfc1459';
    extra: string[];
}

/**
 * Features supported by the server
 * (initial values are RFC 1459 defaults. Zeros signify
 * no default or unlimited value)
 */
export const DefaultIrcSupported = {
    channel: {
        idlength: {},
        length: 200,
        limit: {},
        modes: { a: '', b: '', c: '', d: ''},
        types: '',
    },
    kicklength: 0,
    maxlist: {},
    maxtargets: {},
    modes: 3,
    nicklength: 9,
    topiclength: 0,
    usermodes: '',
    usermodepriority: '', // E.g "ov"
    casemapping: 'ascii',
    extra: [],
} as IrcSupported;

export interface ChanData {
    created?: string;
    key: string;
    serverName: string;
    /**
     * nick => mode
     */
    users: Map<string, string>,
    tmpUsers: Map<string, string>, // used while processing NAMES replies
    mode: string;
    modeParams: Map<string, string[]>,
    topic?: string;
    topicBy?: string;
}

export interface IrcClientState {
    loggedIn: boolean;
    registered: boolean;
    /**
    * This will either be the requested nick or the actual nickname.
    */
   currentNick: string;
   whoisData: Map<string, WhoisResponse>;
   nickMod: number;
   modeForPrefix: {[prefix: string]: string}; // @ => o
   capabilities: IrcCapabilities;
   supportedState: IrcSupported;
   hostMask: string;
   chans: Map<string, ChanData>;
   prefixForMode: {[mode: string]: string}; // o => @
   lastSendTime: number;
   flush?: () => void;
}

export class IrcInMemoryState implements IrcClientState {
    public loggedIn = false;
    public registered = false;
    public currentNick = '';
    public whoisData = new Map<string, WhoisResponse>();
    public nickMod = 0;
    public modeForPrefix: {[prefix: string]: string} = {};
    public prefixForMode: {[mode: string]: string} = {}; // o => @
    public hostMask = '';
    public chans = new Map<string, ChanData>();
    public lastSendTime = 0;
    public capabilities: IrcCapabilities = new IrcCapabilities();
    constructor (public supportedState: IrcSupported) {

    }
}

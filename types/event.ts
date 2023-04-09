import * as baileys from "@adiwajshing/baileys";
import { Chat } from "@adiwajshing/baileys/lib/Types/Chat";
import { Contact } from "@adiwajshing/baileys/lib/Types/Contact";
import { WAMessage, MessageUpsertType } from "@adiwajshing/baileys/lib/Types/Message";
import { WebSocketInfo } from  './socket'

export declare type presenceUpdate = {
    id: string;
    presences: {
        [participant: string]: baileys.PresenceData;
    };
};

export type messagingHistorySet = {
    chats: Chat[];
    contacts: Contact[];
    messages: WAMessage[];
    isLatest: boolean;
};

export type messagesUpsert = {
    messages: WAMessage[];
    type: MessageUpsertType;
};

export type normalizedWAMessage = {
    waMessage: baileys.WAMessage, //
    type: keyof baileys.proto.IMessage | undefined; //
    status?: (baileys.proto.WebMessageInfo.Status|null); //
    pushName?: string | null; //
    from: string; //
    sender: string; //
    fromMe: boolean; //
    id?: string | null; //
    isGroup: boolean; //
    isBot?: boolean | null; //
    msg: any; //
    mentions?: string[];
    quoted?: baileys.proto.IMessage & IQuoted;
    isCreator?: boolean; 
    isMedia?: boolean;
    displayText: string;  //
    displayId: string //
    isCommand: boolean; //
    prefix?: string; //
    // prefix?: "" | "'" | "/" | "\\" | "~" | "." | "," | ";" | ":"; //
    command?: string; //
    body?: string; //
    args?: string[]; //
    flags?: string[]; //
    // delete: (fromMe: boolean) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo | undefined>;
    reply: (content: import("@adiwajshing/baileys/lib/Types").AnyMessageContent) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo|undefined>;
    textReply: (content: import("@adiwajshing/baileys/lib/Types").AnyMessageContent) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo|undefined>;
    AudioReply: (content: import("@adiwajshing/baileys/lib/Types").AnyMessageContent) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo|undefined>;
    sendMessageWithRecording: (socket: WebSocketInfo, jid: string, content: baileys.AnyMessageContent, options: baileys.MiscMessageGenerationOptions ) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo|undefined>;
    sendMessageWithTyping: (socket: WebSocketInfo, jid: string, content: baileys.AnyMessageContent, options: baileys.MiscMessageGenerationOptions ) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo|undefined>;
}

interface IQuoted { 
    type: keyof baileys.proto.IMessage | undefined;
    msg: any;
    mentions: string[];
    id: string;
    sender: string;
    from: string;
    isGroup: boolean;
    isBot: boolean;
    fromMe: boolean;
    text: any;
    fakeObj: object;
    reply: (content: import("@adiwajshing/baileys/lib/Types").AnyMessageContent) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo>;
    delete: (fromMe: boolean) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo | undefined>;
    // download = (pathFile: string) =>
}

export const messageStubTypeList = [
    "UNKNOWN",
    "REVOKE",
    "CIPHERTEXT",
    "FUTUREPROOF",
    "NON_VERIFIED_TRANSITION",
    "UNVERIFIED_TRANSITION",
    "VERIFIED_TRANSITION",
    "VERIFIED_LOW_UNKNOWN",
    "VERIFIED_HIGH",
    "VERIFIED_INITIAL_UNKNOWN",
    "VERIFIED_INITIAL_LOW",
    "VERIFIED_INITIAL_HIGH",
    "VERIFIED_TRANSITION_ANY_TO_NONE",
    "VERIFIED_TRANSITION_ANY_TO_HIGH",
    "VERIFIED_TRANSITION_HIGH_TO_LOW",
    "VERIFIED_TRANSITION_HIGH_TO_UNKNOWN",
    "VERIFIED_TRANSITION_UNKNOWN_TO_LOW",
    "VERIFIED_TRANSITION_LOW_TO_UNKNOWN",
    "VERIFIED_TRANSITION_NONE_TO_LOW",
    "VERIFIED_TRANSITION_NONE_TO_UNKNOWN",
    "GROUP_CREATE",
    "GROUP_CHANGE_SUBJECT",
    "GROUP_CHANGE_ICON",
    "GROUP_CHANGE_INVITE_LINK",
    "GROUP_CHANGE_DESCRIPTION",
    "GROUP_CHANGE_RESTRICT",
    "GROUP_CHANGE_ANNOUNCE",
    "GROUP_PARTICIPANT_ADD",
    "GROUP_PARTICIPANT_REMOVE",
    "GROUP_PARTICIPANT_PROMOTE",
    "GROUP_PARTICIPANT_DEMOTE",
    "GROUP_PARTICIPANT_INVITE",
    "GROUP_PARTICIPANT_LEAVE",
    "GROUP_PARTICIPANT_CHANGE_NUMBER",
    "BROADCAST_CREATE",
    "BROADCAST_ADD",
    "BROADCAST_REMOVE",
    "GENERIC_NOTIFICATION",
    "E2E_IDENTITY_CHANGED",
    "E2E_ENCRYPTED",
    "CALL_MISSED_VOICE",
    "CALL_MISSED_VIDEO",
    "INDIVIDUAL_CHANGE_NUMBER",
    "GROUP_DELETE",
    "GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE",
    "CALL_MISSED_GROUP_VOICE",
    "CALL_MISSED_GROUP_VIDEO",
    "PAYMENT_CIPHERTEXT",
    "PAYMENT_FUTUREPROOF",
    "PAYMENT_TRANSACTION_STATUS_UPDATE_FAILED",
    "PAYMENT_TRANSACTION_STATUS_UPDATE_REFUNDED",
    "PAYMENT_TRANSACTION_STATUS_UPDATE_REFUND_FAILED",
    "PAYMENT_TRANSACTION_STATUS_RECEIVER_PENDING_SETUP",
    "PAYMENT_TRANSACTION_STATUS_RECEIVER_SUCCESS_AFTER_HICCUP",
    "PAYMENT_ACTION_ACCOUNT_SETUP_REMINDER",
    "PAYMENT_ACTION_SEND_PAYMENT_REMINDER",
    "PAYMENT_ACTION_SEND_PAYMENT_INVITATION",
    "PAYMENT_ACTION_REQUEST_DECLINED",
    "PAYMENT_ACTION_REQUEST_EXPIRED",
    "PAYMENT_ACTION_REQUEST_CANCELLED",
    "BIZ_VERIFIED_TRANSITION_TOP_TO_BOTTOM",
    "BIZ_VERIFIED_TRANSITION_BOTTOM_TO_TOP",
    "BIZ_INTRO_TOP",
    "BIZ_INTRO_BOTTOM",
    "BIZ_NAME_CHANGE",
    "BIZ_MOVE_TO_CONSUMER_APP",
    "BIZ_TWO_TIER_MIGRATION_TOP",
    "BIZ_TWO_TIER_MIGRATION_BOTTOM",
    "OVERSIZED",
    "GROUP_CHANGE_NO_FREQUENTLY_FORWARDED",
    "GROUP_V4_ADD_INVITE_SENT",
    "GROUP_PARTICIPANT_ADD_REQUEST_JOIN",
    "CHANGE_EPHEMERAL_SETTING",
    "E2E_DEVICE_CHANGED",
    "VIEWED_ONCE",
    "E2E_ENCRYPTED_NOW",
    "BLUE_MSG_BSP_FB_TO_BSP_PREMISE",
    "BLUE_MSG_BSP_FB_TO_SELF_FB",
    "BLUE_MSG_BSP_FB_TO_SELF_PREMISE",
    "BLUE_MSG_BSP_FB_UNVERIFIED",
    "BLUE_MSG_BSP_FB_UNVERIFIED_TO_SELF_PREMISE_VERIFIED",
    "BLUE_MSG_BSP_FB_VERIFIED",
    "BLUE_MSG_BSP_FB_VERIFIED_TO_SELF_PREMISE_UNVERIFIED",
    "BLUE_MSG_BSP_PREMISE_TO_SELF_PREMISE",
    "BLUE_MSG_BSP_PREMISE_UNVERIFIED",
    "BLUE_MSG_BSP_PREMISE_UNVERIFIED_TO_SELF_PREMISE_VERIFIED",
    "BLUE_MSG_BSP_PREMISE_VERIFIED",
    "BLUE_MSG_BSP_PREMISE_VERIFIED_TO_SELF_PREMISE_UNVERIFIED",
    "BLUE_MSG_CONSUMER_TO_BSP_FB_UNVERIFIED",
    "BLUE_MSG_CONSUMER_TO_BSP_PREMISE_UNVERIFIED",
    "BLUE_MSG_CONSUMER_TO_SELF_FB_UNVERIFIED",
    "BLUE_MSG_CONSUMER_TO_SELF_PREMISE_UNVERIFIED",
    "BLUE_MSG_SELF_FB_TO_BSP_PREMISE",
    "BLUE_MSG_SELF_FB_TO_SELF_PREMISE",
    "BLUE_MSG_SELF_FB_UNVERIFIED",
    "BLUE_MSG_SELF_FB_UNVERIFIED_TO_SELF_PREMISE_VERIFIED",
    "BLUE_MSG_SELF_FB_VERIFIED",
    "BLUE_MSG_SELF_FB_VERIFIED_TO_SELF_PREMISE_UNVERIFIED",
    "BLUE_MSG_SELF_PREMISE_TO_BSP_PREMISE",
    "BLUE_MSG_SELF_PREMISE_UNVERIFIED",
    "BLUE_MSG_SELF_PREMISE_VERIFIED",
    "BLUE_MSG_TO_BSP_FB",
    "BLUE_MSG_TO_CONSUMER",
    "BLUE_MSG_TO_SELF_FB",
    "BLUE_MSG_UNVERIFIED_TO_BSP_FB_VERIFIED",
    "BLUE_MSG_UNVERIFIED_TO_BSP_PREMISE_VERIFIED",
    "BLUE_MSG_UNVERIFIED_TO_SELF_FB_VERIFIED",
    "BLUE_MSG_UNVERIFIED_TO_VERIFIED",
    "BLUE_MSG_VERIFIED_TO_BSP_FB_UNVERIFIED",
    "BLUE_MSG_VERIFIED_TO_BSP_PREMISE_UNVERIFIED",
    "BLUE_MSG_VERIFIED_TO_SELF_FB_UNVERIFIED",
    "BLUE_MSG_VERIFIED_TO_UNVERIFIED",
    "BLUE_MSG_BSP_FB_UNVERIFIED_TO_BSP_PREMISE_VERIFIED",
    "BLUE_MSG_BSP_FB_UNVERIFIED_TO_SELF_FB_VERIFIED",
    "BLUE_MSG_BSP_FB_VERIFIED_TO_BSP_PREMISE_UNVERIFIED",
    "BLUE_MSG_BSP_FB_VERIFIED_TO_SELF_FB_UNVERIFIED",
    "BLUE_MSG_SELF_FB_UNVERIFIED_TO_BSP_PREMISE_VERIFIED",
    "BLUE_MSG_SELF_FB_VERIFIED_TO_BSP_PREMISE_UNVERIFIED",
    "E2E_IDENTITY_UNAVAILABLE",
    "GROUP_CREATING",
    "GROUP_CREATE_FAILED",
    "GROUP_BOUNCED",
    "BLOCK_CONTACT",
    "EPHEMERAL_SETTING_NOT_APPLIED",
    "SYNC_FAILED",
    "SYNCING",
    "BIZ_PRIVACY_MODE_INIT_FB",
    "BIZ_PRIVACY_MODE_INIT_BSP",
    "BIZ_PRIVACY_MODE_TO_FB",
    "BIZ_PRIVACY_MODE_TO_BSP",
    "DISAPPEARING_MODE",
    "E2E_DEVICE_FETCH_FAILED",
    "ADMIN_REVOKE",
    "GROUP_INVITE_LINK_GROWTH_LOCKED",
    "COMMUNITY_LINK_PARENT_GROUP",
    "COMMUNITY_LINK_SIBLING_GROUP",
    "COMMUNITY_LINK_SUB_GROUP",
    "COMMUNITY_UNLINK_PARENT_GROUP",
    "COMMUNITY_UNLINK_SIBLING_GROUP",
    "COMMUNITY_UNLINK_SUB_GROUP",
    "GROUP_PARTICIPANT_ACCEPT",
    "GROUP_PARTICIPANT_LINKED_GROUP_JOIN",
    "COMMUNITY_CREATE",
    "EPHEMERAL_KEEP_IN_CHAT",
    "GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST",
    "GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE",
    "INTEGRITY_UNLINK_PARENT_GROUP",
    "COMMUNITY_PARTICIPANT_PROMOTE",
    "COMMUNITY_PARTICIPANT_DEMOTE",
    "COMMUNITY_PARENT_GROUP_DELETED",
  ];
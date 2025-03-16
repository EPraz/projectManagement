"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let EventsGateway = class EventsGateway {
    afterInit(server) {
    }
    handleConnection(client) {
    }
    handleDisconnect(client) {
    }
    emitTicketUpdate(data) {
        this.server.emit('ticketUpdated', data);
    }
    emitTicketCreate(data) {
        this.server.emit('ticketCreated', data);
    }
    emitTicketDelete(data) {
        this.server.emit('ticketDeleted', data);
    }
    emitSprintUpdate(data) {
        this.server.emit('sprintUpdated', data);
    }
    emitSprintCreate(data) {
        this.server.emit('sprintCreated', data);
    }
    emitSprintDelete(data) {
        this.server.emit('sprintDeleted', data);
    }
    emitProjectUpdate(data) {
        this.server.emit('projectUpdated', data);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } })
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map
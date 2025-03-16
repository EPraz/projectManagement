"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTaskStatuses = exports.defaultTicketStatuses = exports.defaultFeatureStatuses = exports.defaultEpicStatuses = void 0;
const verde = '#4CAF50';
const naranja = '#FF9800';
const azul = '#03A9F4';
const azulOscuro = '#2196F3';
const rojo = '#F44336';
const verdeClaro = '#8BC34A';
const gris = '#9E9E9E';
const amarillo = '#FFEB3B';
exports.defaultEpicStatuses = [
    { name: 'NEW', position: 0, color: verde },
    { name: 'ANALYZING', position: 1, color: naranja },
    { name: 'PLANNING', position: 2, color: azul },
    { name: 'IN_PROGRESS', position: 3, color: azulOscuro },
    { name: 'BLOCKED', position: 4, color: rojo },
    { name: 'COMPLETED', position: 5, color: verdeClaro },
    { name: 'ARCHIVED', position: 6, color: gris },
];
exports.defaultFeatureStatuses = [
    { name: 'NEW', position: 0, color: verde },
    { name: 'ANALYZING', position: 1, color: naranja },
    { name: 'PLANNING', position: 2, color: azul },
    { name: 'IN_PROGRESS', position: 3, color: azulOscuro },
    { name: 'BLOCKED', position: 4, color: rojo },
    { name: 'READY_FOR_TESTING', position: 5, color: amarillo },
    { name: 'TESTING', position: 6, color: '#FFC107' },
    { name: 'DEPLOYMENT', position: 7, color: '#3F51B5' },
    { name: 'COMPLETED', position: 8, color: verdeClaro },
    { name: 'ARCHIVED', position: 9, color: gris },
];
exports.defaultTicketStatuses = [
    { name: 'NEW', position: 0, color: verde },
    { name: 'OPEN', position: 1, color: azulOscuro },
    { name: 'IN_PROGRESS', position: 2, color: azul },
    { name: 'BLOCKED', position: 3, color: rojo },
    { name: 'CODE_REVIEW', position: 4, color: '#673AB7' },
    { name: 'TESTING', position: 5, color: amarillo },
    { name: 'DEPLOYMENT', position: 6, color: '#3F51B5' },
    { name: 'COMPLETED', position: 7, color: verdeClaro },
    { name: 'CLOSED', position: 8, color: gris },
    { name: 'COMMITTED', position: 9, color: '#009688' },
    { name: 'ANALYZING', position: 10, color: naranja },
];
exports.defaultTaskStatuses = [
    { name: 'TODO', position: 0, color: gris },
    { name: 'IN_PROGRESS', position: 1, color: azulOscuro },
    { name: 'BLOCKED', position: 2, color: rojo },
    { name: 'CODE_REVIEW', position: 3, color: '#673AB7' },
    { name: 'TESTING', position: 4, color: amarillo },
    { name: 'DONE', position: 5, color: verde },
];
//# sourceMappingURL=DefaultProjectValues.js.map
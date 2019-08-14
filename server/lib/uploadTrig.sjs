'use strict';
declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
sem.graphDelete(sem.defaultGraphIri());
sem.graphDelete(ns.ciri("graph:_data"));
sem.graphDelete(ns.ciri("graph:_model"));
let doc = xdmp.getRequestBody("text");
xdmp.addResponseHeader("Content-Type","text/plain");
let triples = sem.rdfParse(doc,"trig");
sem.rdfInsert(triples);
let count = Array.from(triples).length;
`${count} triples uploaded.`

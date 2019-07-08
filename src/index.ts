import antwerpen = require('./antwerpen');
import vlaanderen from './vlaanderen';
// get rid of TS4082 error
import * as express from 'express';

export = {
  antwerpen,
  vlaanderen
};

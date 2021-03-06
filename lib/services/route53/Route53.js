'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSService = require(primitivesPath).AWSService;
const Zone = require('./Zone');

class Route53 extends AWSService {
        getZoneCount() {
            const { params, callback } = Route53.getArgs(arguments);

            this.getHostedZoneCount(params, resp => {
                callback(resp.HostedZoneCount);
            });
        }

        getZones() {
            const { params, callback } = Route53.getArgs(arguments);

            this.listHostedZones(params, data => {
                const hostedZones = data.HostedZones || [];

                callback(hostedZones.map(zoneData => {
                    return new Zone(zoneData, this);
                }));
            });
        }

        getZoneByName() {
                const { name, params, callback } = Route53.getArgs(arguments, {
                    'string': 'name'
                });

                this.listHostedZones(params, data => {
                    const hostedZones = data.HostedZones || [];

                    const filtered = hostedZones.filter(zone => {
                        return zone.Name === name.trim() || zone.Name === name.trim() + '.';
                    });

                    if (filtered.length > 0) {
                        return callback(filtered.map(z => { return new Zone(z, this); })[0]);
                    } else {
                        callback();
                    }
                });
        }

    supportedMethods() {
        return [
            {
                method: 'listHostedZones'
            },
            {
                    method: 'listHostedZonesByName'
            },
            {
                    method: 'getHostedZone'
            },
            {
                    method: 'getHostedZoneCount'
            },
            {
                method: 'getChange'
            }
        ];
    }

    static get Zone() {
        return Zone;
    }
}

module.exports = Route53;

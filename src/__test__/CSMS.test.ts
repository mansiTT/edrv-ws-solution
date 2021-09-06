import { ERROR_CODE_WITH_MSG } from '../common/constant';
import ChargingStationManagementSystem from '../service/CSMS';

let service: ChargingStationManagementSystem;

beforeAll(() => {
    service = new ChargingStationManagementSystem()
})

const TEST_MSG_1 = "[2,\"6f403ba1-8c62-4a89-a027-d72d28c2a8d4\",\"StatusNotification\",{\"status\":\"Unavailable\",\"errorCode\":\"NoError\",\"connectorId\":1}]"

const TEST_MSG_2 = "[2,\"6f403ba1-8c62-4a89-a027-d72d28c2a8d4\",\"\",{\"status\":\"Unavailable\",\"errorCode\":\"NoError\",\"connectorId\":1}]"

const TEST_MSG_3 = "[2,\"950ef57c-7873-4499-847d-481ecb416fbb\",\"BootNotification\",{\"chargePointVendor\":\"Tesla\",\"chargePointModel\":\"Wall X\"}]"

describe('ChargingStationManagementSystem', () => {

    describe('process', () => {
        it('should return error if empty string passed ', () => {
            const result = service.process("")
            expect(result).toHaveLength(0)

        })

        it('should return NOT IMPLEMENTED error if action is not passed', () => {
            const result = service.process(TEST_MSG_2)
            expect(result).toContain(ERROR_CODE_WITH_MSG.NOT_IMPLEMENTED.CODE)

        })

        it('should return call error in message string for invlaid message', () => {
            const result = service.process(TEST_MSG_2)
            expect(result).toContain("4,")

        })

        it('should return message string with same request Id  ', () => {
            const result = service.process(TEST_MSG_1)
            expect(result).toContain("6f403ba1-8c62-4a89-a027-d72d28c2a8d4")

        })

        it('should return call result in message string ', () => {
            const result = service.process(TEST_MSG_1)
            expect(result).toContain("3,")

        })

        it('should return payload for BootNotification ', () => {
            const result = service.process(TEST_MSG_3)
            expect(result).toContain("\"status\":\"Accepted\"") 

        })

        it('should return empty payload for StatusNotification ', () => {
            const result = service.process(TEST_MSG_1)
            expect(result).toContain("{}")

        })
    })
})

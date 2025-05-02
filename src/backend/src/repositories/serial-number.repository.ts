import { EntityRepository, Repository } from "typeorm";
import { SerialNumber } from "../models/inventory/serial-number.model";

@EntityRepository(SerialNumber)
export class SerialNumberRepository extends Repository<SerialNumber> {
  
  /**
   * Find serial numbers by item ID
   */
  async findByItemId(itemId: number): Promise<SerialNumber[]> {
    return this.find({
      where: { item: { id: itemId } },
      relations: ['lot'],
      order: { serialNumber: 'ASC' }
    });
  }

  /**
   * Find serial numbers by lot ID
   */
  async findByLotId(lotId: number): Promise<SerialNumber[]> {
    return this.find({
      where: { lot: { id: lotId } },
      order: { serialNumber: 'ASC' }
    });
  }

  /**
   * Find serial numbers by status
   */
  async findByStatus(status: string): Promise<SerialNumber[]> {
    return this.find({
      where: { status },
      relations: ['item', 'lot'],
      order: { serialNumber: 'ASC' }
    });
  }

  /**
   * Find serial number by serial number string
   */
  async findBySerialNumberString(serialNumber: string): Promise<SerialNumber | undefined> {
    const result = await this.findOne({
      where: { serialNumber },
      relations: ['item', 'lot', 'fabricRoll']
    });
    return result || undefined;
  }

  /**
   * Update serial number status
   */
  async updateStatus(id: number, status: string, location?: string, notes?: string): Promise<SerialNumber> {
    const serialNumber = await this.findOne({ where: { id } });
    if (!serialNumber) {
      throw new Error('Serial number not found');
    }

    serialNumber.status = status;
    
    if (location) {
      serialNumber.location = location;
    }
    
    if (notes) {
      serialNumber.notes = notes;
    }
    
    return this.save(serialNumber);
  }

  /**
   * Generate a new serial number for an item
   */
  async generateSerialNumber(itemId: number, lotId?: number): Promise<string> {
    // Get the item code
    const item = await this.manager.findOne('Item', { where: { id: itemId } });
    if (!item) {
      throw new Error('Item not found');
    }

    // Get the current date in YYYYMMDD format
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');

    // Get the item code from the item
    const itemCode = (item as any).itemCode || `ITEM-${itemId}`;
    
    // Get the count of existing serial numbers for this item today
    const count = await this.createQueryBuilder('serial')
      .where('serial.item.id = :itemId', { itemId })
      .andWhere('serial.serialNumber LIKE :pattern', { pattern: `${itemCode}-${dateStr}%` })
      .getCount();

    // Generate the new serial number
    const sequenceNumber = (count + 1).toString().padStart(4, '0');
    return `${itemCode}-${dateStr}-${sequenceNumber}`;
  }

  /**
   * Get serial numbers with barcode data
   */
  async getSerialNumbersWithBarcodes(itemId: number): Promise<any[]> {
    const serialNumbers = await this.find({
      where: { item: { id: itemId } },
      relations: ['item', 'lot']
    });
    
    return serialNumbers.map(sn => {
      const item = sn.item as any;
      return {
        id: sn.id,
        serialNumber: sn.serialNumber,
        status: sn.status,
        location: sn.location,
        barcode: (sn as any).barcode,
        qrCodeData: (sn as any).qrCodeData || JSON.stringify({
          serialNumber: sn.serialNumber,
          itemId: item.id,
          itemCode: item.itemCode,
          itemName: item.name,
          lotNumber: sn.lot?.lotNumber
        })
      };
    });
  }
}
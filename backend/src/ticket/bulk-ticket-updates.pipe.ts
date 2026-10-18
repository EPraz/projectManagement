import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { createValidationPipe } from '../validation';
import { BulkUpdateTicketDto } from './bulk-update-ticket.dto';

@Injectable()
export class BulkTicketUpdatesPipe
  implements PipeTransform<unknown, Promise<BulkUpdateTicketDto[]>>
{
  private readonly validation = createValidationPipe();

  async transform(value: unknown): Promise<BulkUpdateTicketDto[]> {
    if (
      !Array.isArray(value) ||
      value.length === 0 ||
      value.some(
        (item: unknown) =>
          !item || typeof item !== 'object' || Array.isArray(item),
      )
    )
      throw new BadRequestException(
        'Provide a nonempty array of ticket changes',
      );
    return await Promise.all(
      value.map(async (item: unknown) => {
        const validated: unknown = await this.validation.transform(item, {
          type: 'body',
          metatype: BulkUpdateTicketDto,
        });
        if (!(validated instanceof BulkUpdateTicketDto))
          throw new BadRequestException('Invalid ticket change');
        return validated;
      }),
    );
  }
}

import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ValidationProductPipe implements PipeTransform {
  transform(value: any) {
    this.validateProduct(value);
    return value;
  }

  private validateProduct(value: any) {
    if (!value.name || !value.price || !value.description || !value.images) {
      throw new BadRequestException('Invalid product');
    }
    if (value.images.length < 1) {
      throw new BadRequestException('Images must be less than 1');
    }
    if (value.images.length > 3) {
      throw new BadRequestException('Images must be less than 3');
    }

    if (value.name.length < 1) {
      throw new BadRequestException('Name must be less than 1');
    }
    if (value.name.length > 100) {
      throw new BadRequestException('Name must be less than 100');
    }

    if (value.price < 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    if (value.description.length < 1) {
      throw new BadRequestException('Description must be less than 1');
    }
    if (value.description.length > 1000) {
      throw new BadRequestException('Description must be less than 1000');
    }
  }
}

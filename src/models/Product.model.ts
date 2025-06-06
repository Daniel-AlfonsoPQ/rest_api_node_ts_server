import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'products'
})

class Product extends Model{
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.FLOAT(6,2),
        allowNull: false
    })
    price: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    isAvailable: boolean;
}

export default Product
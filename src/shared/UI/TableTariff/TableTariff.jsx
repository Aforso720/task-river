import React from 'react'
import './TableTariff.scss'

const TableTariff = () => {
  return (
    <table>
        <thead>
            <tr>
                <th colSpan={3}></th>
                <th className='font-semibold text-2xl'>Бесплатый</th>
                <th className='font-semibold text-2xl'>Старндарт</th>
                <th className='font-semibold text-2xl'>Премиум</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className='font-semibold text-xl'>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
            </tr>
            <tr>
                <td className='font-semibold text-xl'>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
            </tr>
            <tr>
                <td className='font-semibold text-xl'>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td>Улучшить</td>
                <td>Улучшить</td>
                <td>Улучшить</td>
                <td colSpan={3}></td>
            </tr>
        </tfoot>
    </table>
  )
}

export default TableTariff

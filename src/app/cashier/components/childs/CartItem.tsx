"use client";
import React from 'react'
import { TableCell, TableRow, IconButton, Input, debounce } from '@mui/material';
import { Add, AddTwoTone, DeleteTwoTone, RemoveTwoTone } from '@mui/icons-material';
import { CartItem, CartState } from '@/atoms/cart'
import { useRecoilState } from 'recoil';
import { Confirmation, useConfirm } from '@/hooks/use-confirm';
import { number } from '@/libs/formatter';

const getRealCount = (item: CartItem) => {
  const canOverstock = item.category?.overstock;
  const isOverstock = item.count > item.stock;

  console.log(item);
  
  if (!canOverstock && isOverstock) return item.stock;
  return item.count;
}

const getBackgroundColor = (item : CartItem, grow : boolean) => {
  const canOverstock = item.category?.overstock || false;
  
  // OVERSTOCK
  if (item.count > item.stock && canOverstock && grow) return 'var(--mui-palette-Slider-errorTrack)';
  if (item.count > item.stock && canOverstock) return 'var(--mui-palette-Alert-errorStandardBg)';

  // FULL
  if (item.count >= item.stock && !canOverstock && grow) return 'var(--mui-palette-Slider-warningTrack)';
  if (item.count >= item.stock && !canOverstock) return 'var(--mui-palette-Alert-warningStandardBg)';

  // NORMAL
  if (grow) return 'var(--mui-palette-Alert-successStandardBg)';
}

export const Item = (props: CartItem) => {
  const [grow, setGrow] = React.useState<boolean>(false);
  const [, setCart] = useRecoilState(CartState);
  const _count = getRealCount(props);
  const prevCountRef = React.useRef(props.count);

  function limitNumberWithinRange(num : number, min : number, max : number){
    const MIN = min ?? 1;
    const MAX = max ?? 20;
    return Math.max(+num, MIN)
  }

  const countController = (delta : number) => {
    const isFull = props.count >= props.stock;
    if (isFull && !props.category?.overstock && delta > 0) return ;

    setCart(prevCart => {
      return prevCart.map(item => 
        item.serial === props.serial 
          ? { ...item, count: limitNumberWithinRange(_count + delta, 1, 1000) } 
          : item
      );
    });
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCart(prevCart => {
      return prevCart.map(item => 
        item.serial === props.serial 
          ? { ...item, count: limitNumberWithinRange(+e.target.value, 1, 1000) } 
          : item
      );
    });
  }

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบสินค้าหรือไม่ ?",
    confirmProps: {
      startIcon: <DeleteTwoTone />,
      color: "error"
    },
    onConfirm: async () => setCart(prev => prev.filter(i => i.serial != props.serial))
  });

  React.useEffect(() => {
    let timeout : NodeJS.Timeout | null = null;
    if (props.count > prevCountRef.current) {
      setGrow(true);
      timeout = setTimeout(() => {
        setGrow(false);
      }, 200);
    }
    
    prevCountRef.current = props.count;
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
        setGrow(false);
      }
    }
  }, [props.count]);

  return (
    <TableRow
      sx={{ 
        'backgroundColor': getBackgroundColor(props, grow),
        '&:last-child td, &:last-child th': { border: 0 } 
      }}
    >
      <TableCell >{props.serial}</TableCell>
      <TableCell >{props.label}</TableCell>
      <TableCell >{number(props.price * _count)}{_count > 1 && ` (${number(props.price)})`}</TableCell>
      <TableCell >{number(props.stock)}</TableCell>
      <TableCell >
        <IconButton onClick={() => countController(-1)}><RemoveTwoTone/></IconButton>
        <Input disableUnderline sx={{width: '3em'}} inputProps={{min: 0, style: { textAlign: 'center' }}}  type='number' value={_count} onChange={onChange}/>
        <IconButton onClick={() => countController(1)}><AddTwoTone /></IconButton>
      </TableCell>
      <TableCell>
          <IconButton onClick={confirmation.handleOpen}><DeleteTwoTone/></IconButton>
          <Confirmation {...confirmation.props} />
      </TableCell>
    </TableRow>
  )
}
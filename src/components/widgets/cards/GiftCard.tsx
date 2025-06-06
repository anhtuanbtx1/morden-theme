import React, {useEffect} from 'react';
import { CardContent, Typography, Grid, Button, CardMedia, IconButton, Stack, Skeleton } from '@mui/material';
import img1 from 'src/assets/images/products/s1.jpg';
import img2 from 'src/assets/images/products/s2.jpg';
import BlankCard from '../../shared/BlankCard';
import { IconGift } from '@tabler/icons';

interface giftType {
  title: string;
  avatar: string;
}

const giftCard: giftType[] = [
  {
    title: 'Andrew Grant',
    avatar: img1,
  },
  {
    title: 'Leo Pratt',
    avatar: img2,
  },
];

const GiftCard = () => {

  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Grid container spacing={3}>
      {giftCard.map((card, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <BlankCard>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="h6" mb={1}>
                  {card.title}
                </Typography>

                <IconButton color="secondary">
                  <IconGift width={20} />
                </IconButton>
              </Stack>
              {isLoading ? (
                <Skeleton variant="rectangular" animation="wave" width="100%" height={160}></Skeleton>
              ) : (
                <CardMedia
                  component="img"
                  image={card.avatar}
                  sx={{
                    borderRadius: 2,
                    width: '100%',
                    objectFit: 'contain',
                    aspectRatio: '16/9'
                  }}
                />
              )}
              <Stack spacing={2} mt={3}>
                <Button size="large" variant="contained" color="primary">
                  Gift to Friend ($50.00)
                </Button>
              </Stack>
            </CardContent>
          </BlankCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default GiftCard;

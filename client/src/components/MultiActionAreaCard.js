import * as React from "react";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

export default function MultiActionAreaCard(props) {
  const [showPayment, setShowPayment] = React.useState(false);
  const [qtySelected, setQty] = React.useState(1);

  const handleQtyChange = (event) => {
    setQty(event.target.value);
  };

  const buyClickHandler = (product, qty) => {
    setShowPayment(true);
    setQty(qty);
    props.addToCart(product, qty);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={props.product.url}
          alt={props.product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.product.description}
          </Typography>
          <Typography variant="body3" color="text.secondary">
            {props.product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <TextField
          value={qtySelected}
          onChange={handleQtyChange}
          type="number"
          size="small"
          sx={{ width: 70 }}
        ></TextField>
        <IconButton size="small" onClick={() => setQty(qtySelected + 1)}>
          <AddIcon />
        </IconButton>
        <Button
          size="small"
          color="primary"
          onClick={() => buyClickHandler(props.product, qtySelected)}
        >
          Add To Cart
        </Button>
      </CardActions>
    </Card>
  );
}

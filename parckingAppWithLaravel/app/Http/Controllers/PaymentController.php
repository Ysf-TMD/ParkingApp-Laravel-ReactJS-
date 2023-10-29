<?php
namespace App\Http\Controllers;



use Illuminate\Http\Request;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use ErrorException;

class PaymentController extends Controller
{
    /** Pay order via stripe */
    public function payByStripe(Request $request){
        Stripe::setApiKey('sk_test_51O6LJuEptk0JHvy66xXepxyrEpLqI9Yix3dJ3dsHQJkYtlzDpc4jFkzSwqnc2LVITDjRnM43aEEjjhYpmuPEOX3u00qg3fzwRO');

        try {

            // Create a PaymentIntent with amount and currency
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount*100,
                'currency' => 'usd',
                'description' => 'React Parking ',
                'setup_future_usage' => 'on_session'
            ]);

            $output = [
                'clientSecret' => $paymentIntent->client_secret,
            ];
            return response()->json($output);

        } catch (ErrorException $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    /** Calculate order total for stripe */
    public function calculateOrderAmount(array $items): int {
        // Replace this constant with a calculation of the order's amount
        // Calculate the order total on the server to prevent
        // people from directly manipulating the amount on the client
        foreach($items as $item){
            return $item->amount * 100;
        }
    }
}




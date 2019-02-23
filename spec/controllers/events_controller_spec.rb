require 'rails_helper'

RSpec.describe Api::EventsController, type: :controller do
  describe 'GET #index' do
    context 'valid authentication' do
      before do
        user = create(:user)
        user2 = create(:user)
        add_authenticated_header(request, user)

        event = create(:event, creator: user)
        chosen_place = create(:place_poll_option, event: event)
        chosen_date = create(:date_poll_option, event: event)
        event.chosen_place = chosen_place
        event.chosen_date = chosen_date
        event.participants << user2
        event.save

        event2 = create(:event, creator: user)
        chosen_place2 = create(:place_poll_option, event: event2)
        chosen_date2 = create(:date_poll_option_old, event: event2)
        event2.chosen_place = chosen_place2
        event2.chosen_date = chosen_date2
        event2.participants << user2
        event2.save

        get :index
        @json = JSON.parse(response.body)
      end

      it 'should return http code 200' do
        expect(response).to have_http_status(200)
      end

      it "should return the events" do
        expect(@json['events'].length).to eql(2)
      end

      it "should return the event's nested dependencies" do
        expect(@json['events'][0]['chosen_place']).to be_truthy
        expect(@json['events'][0]['chosen_date']).to be_truthy
        expect(@json['events'][0]['participants']).to be_truthy
        expect(@json['events'][0]['participants'].length).to eql(2)
      end

      it "shouldn't show the user's password hash" do
        expect(@json['events'][0]['participants'][0]).not_to include('password_hash')
      end
    end

    context 'unauthorized' do
      it 'should return 401 unauthorized' do
        user = create(:user)
        create(:event, creator: user)
        get :index
        expect(response).to have_http_status(401)
      end
    end
  end
end

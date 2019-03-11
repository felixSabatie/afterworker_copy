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

        event2 = create(:event, creator: user2)
        chosen_place2 = create(:place_poll_option, event: event2)
        chosen_date2 = create(:date_poll_option_old, event: event2)
        event2.chosen_place = chosen_place2
        event2.chosen_date = chosen_date2
        event2.participants << user
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
        expect(@json['events'][0]['participants'][0]).not_to include('password_digest')
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

  describe 'POST #create' do
    context 'valid basic event' do
      before do
        @user = create(:user)
        add_authenticated_header(request, @user)
        post :create, params: {event: attributes_for(:event)}
        @json = JSON.parse(response.body)
      end

      it 'should create the event' do
        expect(response).to have_http_status(200)
        expect(Event.count).to eq(1)
      end

      it 'should return the event' do
        expect(@json).to include('event')
      end

      it 'should set the current user as the event\'s creator' do
        expect(@json['event']['creator']['id']).to eql(@user.id)
      end
    end

    context 'valid event with place set' do
      before do
        @user = create(:user)
        add_authenticated_header(request, @user)
        event = build(:event)
        event.has_place_poll = false
        post :create, params: {event: event.attributes, place: attributes_for(:place_poll_option)}
        @json = JSON.parse(response.body)
      end

      it 'should create the event' do
        expect(response).to have_http_status(200)
        expect(Event.count).to eq(1)
      end

      it 'should create the place poll option' do
        expect(PlacePollOption.count).to eq(1)
      end

      it 'should return the event' do
        expect(@json).to include('event')
      end

      it 'should return the event\'s chosen place' do
        expect(@json['event']['chosen_place']).to be_truthy
      end
    end

    context 'valid event with date set' do
      before do
        @user = create(:user)
        add_authenticated_header(request, @user)
        event = build(:event)
        event.has_date_poll = false
        post :create, params: {event: event.attributes, date: attributes_for(:date_poll_option)}
        @json = JSON.parse(response.body)
      end

      it 'should create the event' do
        expect(response).to have_http_status(200)
        expect(Event.count).to eq(1)
      end

      it 'should create the date poll option' do
        expect(DatePollOption.count).to eq(1)
      end

      it 'should return the event' do
        expect(@json).to include('event')
      end

      it 'should return the event\'s chosen date' do
        expect(@json['event']['chosen_date']).to be_truthy
      end
    end

    context 'valid event with place and date set' do
      before do
        @user = create(:user)
        add_authenticated_header(request, @user)
        event = build(:event)
        event.has_date_poll = false
        event.has_place_poll = false
        post :create, params: {event: event.attributes, date: attributes_for(:date_poll_option), place: attributes_for(:place_poll_option)}
        @json = JSON.parse(response.body)
      end

      it 'should create the event' do
        expect(response).to have_http_status(200)
        expect(Event.count).to eq(1)
      end

      it 'should create the date poll option' do
        expect(DatePollOption.count).to eq(1)
      end

      it 'should create the place poll option' do
        expect(PlacePollOption.count).to eq(1)
      end

      it 'should return the event' do
        expect(@json).to include('event')
      end

      it 'should return the event\'s chosen date' do
        expect(@json['event']['chosen_date']).to be_truthy
      end

      it 'should return the event\'s chosen place' do
        expect(@json['event']['chosen_place']).to be_truthy
      end
    end

    context 'invalid event' do
      it 'should return a 422 error because missing date' do
        @user = create(:user)
        add_authenticated_header(request, @user)
        event = build(:event)
        event.has_date_poll = false
        post :create, params: {event: event.attributes}

        expect(response).to have_http_status(422)
      end

      it 'should return a 422 error because missing place' do
        @user = create(:user)
        add_authenticated_header(request, @user)
        event = build(:event)
        event.has_place_poll = false
        post :create, params: {event: event.attributes}

        expect(response).to have_http_status(422)
      end
    end

    context 'unauthorized' do
      it 'should return 401 unauthorized' do
        @user = create(:user)
        post :create, params: {event: attributes_for(:event)}

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'GET #index' do
    context 'valid authentication' do
      before do
        user = create(:user)
        user2 = create(:user)
        add_authenticated_header(request, user)

        @event = create(:event, creator: user)
        place_poll_option = create(:place_poll_option, event: @event)
        place_poll_option.voters << user2
        chosen_place = create(:place_poll_option, event: @event)
        date_poll_option = create(:date_poll_option, event: @event)
        date_poll_option.voters << user2
        chosen_date = create(:date_poll_option, event: @event)
        @event.chosen_place = chosen_place
        @event.chosen_date = chosen_date
        @event.participants << user2
        @event.save

        get :show, params: {hash: @event.event_hash}
        @json = JSON.parse(response.body)
      end

      it 'should return http code 200' do
        expect(response).to have_http_status(200)
      end

      it "should return the event" do
        expect(@json['event']['id']).to eql(@event.id)
      end

      it "should return the event's nested dependencies" do
        expect(@json['event']['chosen_place']).to be_truthy
        expect(@json['event']['chosen_date']).to be_truthy
        expect(@json['event']['place_poll_options']).to be_truthy
        expect(@json['event']['place_poll_options'].length).to eql(2)
        expect(@json['event']['place_poll_options'][0]['voters'].length).to eql(1)
        expect(@json['event']['place_poll_options'][0]['voters'][0]).not_to include('password_digest')
        expect(@json['event']['date_poll_options']).to be_truthy
        expect(@json['event']['date_poll_options'].length).to eql(2)
        expect(@json['event']['date_poll_options'][0]['voters'][0]).not_to include('password_digest')
        expect(@json['event']['participants']).to be_truthy
        expect(@json['event']['participants'].length).to eql(2)
      end

      it "shouldn't show the user's password hash" do
        expect(@json['event']['participants'][0]).not_to include('password_digest')
      end
    end

    context 'bad request' do
      it 'should return 404' do
        user = create(:user)
        event = create(:event, creator: user)
        add_authenticated_header(request, user)
        get :show, params: {hash: event.id}
        expect(response).to have_http_status(404)
      end
    end

    context 'unauthorized' do
      it 'should return 401 unauthorized when no auth header' do
        user = create(:user)
        event = create(:event, creator: user)
        get :show, params: {hash: event.event_hash}
        expect(response).to have_http_status(401)
      end

      it 'should return 401 unauthorized when user not in event' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user2)
        get :show, params: {hash: event.event_hash}

        expect(response).to have_http_status(401)
      end
    end
  end
end

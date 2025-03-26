<?php

namespace Tests\Unit\Providers;

use App\Providers\AppServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppServiceProviderTest extends TestCase
{
    use RefreshDatabase;

    protected $provider;

    protected function setUp(): void
    {
        parent::setUp();
        $this->provider = new AppServiceProvider($this->app);
    }

    public function test_provider_can_be_instantiated()
    {
        $this->assertInstanceOf(AppServiceProvider::class, $this->provider);
    }

    public function test_register_method_exists()
    {
        $this->assertTrue(method_exists($this->provider, 'register'));
    }

    public function test_boot_method_exists()
    {
        $this->assertTrue(method_exists($this->provider, 'boot'));
    }

    public function test_register_method_can_be_called()
    {
        $this->provider->register();

        $this->assertTrue(true);
    }

    public function test_boot_method_can_be_called()
    {
        $this->provider->boot();

        $this->assertTrue(true);
    }

    public function test_provider_is_registered_in_config()
    {
        $providers = config('app.providers');
        $this->assertContains(AppServiceProvider::class, $providers);
    }
} 